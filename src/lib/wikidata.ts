import { Place } from '../types';

const SFAX_GOV_QID = 'Q241145'; // Sfax Governorate

export async function fetchSfaxPlaces(language: string = 'en'): Promise<Place[]> {
  const langFallback = language === 'ar' ? 'ar,en,fr,mul,default' :
                       language === 'fr' ? 'fr,ar,en,mul,default' : 
                       'en,fr,mul,ar,default';
                       
  const query = `
    SELECT DISTINCT ?item ?itemLabel ?coord ?image ?article ?itemDescription WHERE {
      ?item wdt:P131* wd:${SFAX_GOV_QID} .
      ?item wdt:P625 ?coord .
      
      {
        VALUES ?touristClass { 
          wd:Q570116  # tourist attraction
          wd:Q1200957 # tourist destination
          wd:Q33506   # museum
          wd:Q4989906 # monument
          wd:Q1081138 # historic site
          wd:Q839954  # archaeological site
          wd:Q32815   # mosque
          wd:Q82117   # city gate
          wd:Q2001465 # zawiya
          wd:Q510177  # souq
          wd:Q1785071 # fort
          wd:Q15661340 # ancient city
          wd:Q7362268 # Roman amphitheatre
          wd:Q2065736 # cultural property
          wd:Q54831   # amphitheatre
          wd:Q24354   # theatre building
          wd:Q57831   # fortress
          wd:Q22698   # park
          wd:Q46169   # national park
          wd:Q473972  # protected area
          wd:Q179049  # nature reserve
          wd:Q1128906 # historic centre
          wd:Q40080   # beach
        }
        ?item wdt:P31/wdt:P279* ?touristClass .
      } UNION {
        ?item wdt:P1435 ?heritageStatus .
      }

      OPTIONAL { ?item wdt:P18 ?image . }
      OPTIONAL {
        ?article schema:about ?item ;
                 schema:isPartOf <https://${language}.wikipedia.org/> .
      }
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "${langFallback}".
      }
    }
    LIMIT 300
  `;

  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/sparql-results+json',
        'User-Agent': 'SfaxTouristGuide/1.0 (Contact: turkiabdelwaheb@hotmail.fr)'
      }
    });

    if (!response.ok) {
      throw new Error(`Wikidata query failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Deduplicate by QID
    const placesMap = new Map<string, Place>();

    data.results.bindings.forEach((binding: any) => {
      const qid = binding.item.value.split('/').pop();
      if (!qid || placesMap.has(qid)) return;

      // Extract coordinates from "Point(10.7603 34.7406)"
      const coordMatch = binding.coord?.value.match(/Point\(([^ ]+) ([^)]+)\)/);
      if (!coordMatch) return;

      const lon = parseFloat(coordMatch[1]);
      const lat = parseFloat(coordMatch[2]);

      placesMap.set(qid, {
        id: qid,
        name: binding.itemLabel?.value || 'Unknown Place',
        lat,
        lon,
        image: binding.image?.value,
        wikipediaUrl: binding.article?.value,
        wikidataDescription: binding.itemDescription?.value
      });
    });

    return Array.from(placesMap.values());
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

export async function fetchWikipediaDetails(articleUrl: string, language: string = 'en'): Promise<{ extract: string, thumbnail?: string } | null> {
  if (!articleUrl) return null;
  
  try {
    const title = articleUrl.split('/').pop();
    if (!title) return null;

    // Use the corresponding language wikipedia API if the url matches, else try to use the selected language if possible.
    // Since Wikidata returns the article URL, it usually already contains the language prefix (e.g. https://en.wikipedia.org/...)
    // Let's extract the domain from the articleUrl directly.
    const urlObj = new URL(articleUrl);
    const domain = urlObj.hostname;

    const res = await fetch(`https://${domain}/api/rest_v1/page/summary/${title}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    return {
      extract: data.extract,
      thumbnail: data.thumbnail?.source
    };
  } catch (error) {
    console.error("Error fetching Wikipedia details:", error);
    return null;
  }
}
