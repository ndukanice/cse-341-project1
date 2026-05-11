require('dotenv').config();
const express = require('express');
const { connectToDatabase } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// mount contacts router
const contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
