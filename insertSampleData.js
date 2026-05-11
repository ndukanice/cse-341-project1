require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function insertSampleData() {
  try {
    await client.connect();
    const database = client.db('cse341');
    const contacts = database.collection('contacts');

    // Check if data already exists
    const count = await contacts.countDocuments();
    if (count > 0) {
      console.log('Sample data already exists. Skipping insertion.');
      return;
    }

    const sampleData = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        favoriteColor: 'blue',
        birthday: '1990-05-15'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        favoriteColor: 'green',
        birthday: '1992-08-22'
      },
      {
        firstName: 'Michael',
        lastName: 'Williams',
        email: 'mwilliams@example.com',
        favoriteColor: 'red',
        birthday: '1988-12-03'
      }
    ];

    const result = await contacts.insertMany(sampleData);
    console.log(`${result.insertedCount} documents inserted successfully`);
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.close();
  }
}

insertSampleData();
