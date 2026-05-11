const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db');

const router = express.Router();

// GET /contacts - list all contacts or return single when ?id= is provided
router.get('/', async (req, res) => {
  const { id } = req.query;
  try {
    const { db } = await connectToDatabase();
    if (id) {
      // return single document matching query param id
      const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
      if (!contact) return res.status(404).json({ error: 'Not found' });
      return res.json(contact);
    }

    const contacts = await db.collection('contacts').find({}).toArray();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /contacts - create a new contact
router.post('/', async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'firstName, lastName and email are required' });
  }

  const doc = { firstName, lastName, email, favoriteColor, birthday };

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('contacts').insertOne(doc);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /contacts/:id - get single contact by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { db } = await connectToDatabase();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
