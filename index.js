require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerConfig');
const { connectToDatabase } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Setup Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// mount contacts router
const contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
