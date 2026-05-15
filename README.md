# cse-341-Project1 - Contacts REST API

A complete REST API for managing contacts built with Node.js, Express, and MongoDB.

## Setup

```bash
npm install
npm start
```

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- MongoDB Atlas integration for data persistence
- RESTful API design with proper HTTP status codes
- Interactive Swagger API documentation
- Input validation on POST and PUT requests

## Live Deployment

**Production URL:** https://cse-341-project1-okdp.onrender.com

**Swagger Documentation:** https://cse-341-project1-okdp.onrender.com/api-docs

## API Endpoints

### Get All Contacts
```
GET /contacts
```
Returns an array of all contacts.

### Get Single Contact
```
GET /contacts/:id
```
Returns a specific contact by ID.

**Query Alternative:**
```
GET /contacts?id=<contactId>
```

### Create Contact
```
POST /contacts
Content-Type: application/json

{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required)",
  "favoriteColor": "string",
  "birthday": "string"
}
```
Returns `201 Created` with the new contact's ID.

### Update Contact
```
PUT /contacts/:id
Content-Type: application/json

{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "favoriteColor": "string",
  "birthday": "string"
}
```
At least one field must be provided. Returns `204 No Content` on success.

### Delete Contact
```
DELETE /contacts/:id
```
Removes a contact from the database. Returns `204 No Content` on success.

## Testing

Use the included `contacts.rest` file with the REST Client extension to test all endpoints locally or against the production URL.

## Swagger Documentation

Interactive API documentation is available at `/api-docs` endpoint with:
- Complete endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Example requests
