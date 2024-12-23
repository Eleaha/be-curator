# Curator API
## An API that lets you browse and build personal exhibitions of art and artifacts from the VandA and the Rijks museum.

[Hosted API](https://dev-curator.onrender.com)
[Frontend repo](https://github.com/Eleaha/fe-curator)

## Tech Stack
- Typescript
- Express
- PSQL
- Zod

## Running locally
To run the project locally, clone the repo to your machine, open in your code editor, and run `npm install` to install dependancies.

run the command `npm run dev` to run the web app locally

You'll also need to intall psql, and run ``npm run db-setup`` to create the correct tables.

## Commands
``npm t`` - runs test suite
``npm run build`` - builds javascript files
``npm run db-setup`` - drops and creates test db tables
``npm run seed`` - seeds the test db
``nom run seed-dev`` - seed the development database

## Environment Variables
In order for the project to run, you'll need to set up the following environment variable files:
### .env.test
<pre>
PGDATABASE=[your database name]
PGPASSWORD=[your database 
RIJKSAPIKEY=[generated API key for the Rijks museum]</pre>

### .env.development
<pre>
DATABASE_URL=[your hosted database url]
RIJKSAPIKEY=[generated API key for the Rijks muesum]
</pre>

## Dependencies
- axios 1.7.8
- cors 2.8.5
- dotenv 16.4.5
- express 4.21.1
- pg 8.13.1
- pg-format 1.0.4
- zod 3.23.8

### Dev Dependencies
- jest 29.7.0
- supertest 7.0.0
- ts-jest 29.2.5
- ts-node 10.9.2
- typescript 5.7.2
