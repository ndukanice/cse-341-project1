const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'A simple REST API for managing contacts'
    },
    servers: [
      {
        url: 'https://cse-341-project1-okdp.onrender.com',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'The unique identifier for the contact'
            },
            firstName: {
              type: 'string',
              description: 'Contact first name'
            },
            lastName: {
              type: 'string',
              description: 'Contact last name'
            },
            email: {
              type: 'string',
              description: 'Contact email address'
            },
            favoriteColor: {
              type: 'string',
              description: 'Contact favorite color'
            },
            birthday: {
              type: 'string',
              description: 'Contact birthday'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
