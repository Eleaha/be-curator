ZOD - basically helps you make interfaces and schemas and allows you to throw errors if a schema is not correct

prisma - helps simplify accessing SQL data

Generics in TS - basically like a variable/placeholder for a type that you can use when writing functions if you need it to be able to handle different types

## rijks museum 
https://data.rijksmuseum.nl/docs/api/collection

url formats:

for an individual piece
https://www.rijksmuseum.nl/api/en/collection/SK-A-799?key=SxOZ9X4q

for multiple
https://www.rijksmuseum.nl/api/en/collection?key={api-key}

can use a general search

			"period": "f.dating.period=",

## V&A
example request: https://api.vam.ac.uk/v2/museumobject/O828146


			"year_search_from": "year_made_from=",
			"year_search_to": "year_made_to=",


## science museum API - have to make requests
https://github.com/TheScienceMuseum/collectionsonline-api

can specify if it's an object etc



## Standardised searches

general search
- V&A - q=

location
- V&A - q_place_name=

title/name of piece
- V&A - q_object_name=

type
- V&A - q_object_type=

artist/maker
- V&A - _primaryMaker_name=

location

description
- V&A - physicalDescription

images - always true



SORT FIELDS BY FIELDS POPULATED FOR V AND A