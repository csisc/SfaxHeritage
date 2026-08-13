import urllib.parse
import urllib.request
import json

query = """
    SELECT DISTINCT ?item ?itemLabel ?itemDescription WHERE {
      ?item wdt:P131* wd:Q241145 .
      ?item wdt:P625 ?coord .
      
      {
        VALUES ?touristClass { 
          wd:Q570116 # tourist attraction
          wd:Q1200957 # tourist destination
          wd:Q33506  # museum
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

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "en,fr,mul,ar,default".
      }
    }
"""
url = "https://query.wikidata.org/sparql?query=" + urllib.parse.quote(query)
req = urllib.request.Request(url, headers={'Accept': 'application/sparql-results+json', 'User-Agent': 'Bot/1.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(f"Total bindings: {len(data['results']['bindings'])}")
except Exception as e:
    print(e)
