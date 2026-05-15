const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db');

const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     description: Retrieve a list of all contacts or a single contact by query parameter
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Optional contact ID to retrieve a single contact
 *     responses:
 *       200:
 *         description: Successfully retrieved contact(s)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *                 - $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found (when querying by id)
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     description: Add a new contact to the database
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 insertedId:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
// POST /contacts - create a new contact
router.post('/', async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  
  // All fields are required
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ error: 'firstName, lastName, email, favoriteColor, and birthday are all required' });
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

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     description: Retrieve a specific contact by its ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     description: Update an existing contact's information
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       204:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
// PUT /contacts/:id - update a contact
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  // Validate at least one field is provided
  if (!firstName && !lastName && !email && !favoriteColor && !birthday) {
    return res.status(400).json({ error: 'At least one field must be provided' });
  }

  const updateDoc = {};
  if (firstName) updateDoc.firstName = firstName;
  if (lastName) updateDoc.lastName = lastName;
  if (email) updateDoc.email = email;
  if (favoriteColor) updateDoc.favoriteColor = favoriteColor;
  if (birthday) updateDoc.birthday = birthday;

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     description: Remove a contact from the database
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
// DELETE /contacts/:id - delete a contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
