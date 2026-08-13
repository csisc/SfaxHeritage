import urllib.parse
import urllib.request
import json

query = """
SELECT ?item ?itemLabel WHERE {
  ?item wdt:P131* wd:Q241145 .
  ?item wdt:P625 ?coord .
  VALUES ?touristClass { wd:Q570116 wd:Q33506 wd:Q4989906 wd:Q1081138 wd:Q839954 wd:Q32815 wd:Q82117 wd:Q2001465 wd:Q510177 wd:Q1785071 wd:Q15661340 wd:Q7362268 wd:Q2065736 wd:Q54831 wd:Q24354 wd:Q57831 wd:Q39715 wd:Q22698 }
  ?item wdt:P31/wdt:P279* ?touristClass .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} GROUP BY ?item ?itemLabel
"""
url = "https://query.wikidata.org/sparql?query=" + urllib.parse.quote(query)
req = urllib.request.Request(url, headers={'Accept': 'application/sparql-results+json', 'User-Agent': 'Bot/1.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(f"Total: {len(data['results']['bindings'])}")
except Exception as e:
    print(e)
