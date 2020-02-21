# Recipe Catalog API

## Introduction
Recipe Catalog API is server side for the client Recipe Catalog.
The client can be tested out [here](https://recipes-app-zeta.now.sh/)

### Database
To access the database use the URL below to connect to the client
 - https://powerful-bastion-67782.herokuapp.com

### Methods
  GET || POST || DELETE

### Parameters
 - /api/catalog
 - /api/catalog/:id

### Response
 - Post success response: 201
 - Delete success response: 204
 - Post error response: 400
 - Not found error response: 404

## Built with
 - [Node.js](https://nodejs.org/en/)
 - [PostgreSQL](https://www.postgresql.org/)
 - [Knex.js](http://knexjs.org/)