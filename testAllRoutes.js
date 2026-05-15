const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function runTests() {
  try {
    // Test GET all
    console.log('\n=== GET all contacts ===');
    const allRes = await makeRequest('GET', '/contacts');
    console.log('Status:', allRes.status);
    const contacts = JSON.parse(allRes.body);
    console.log('Count:', contacts.length);
    const testId = contacts[0]._id;
    console.log('Test ID:', testId);

    // Test GET by ID
    console.log('\n=== GET contact by ID ===');
    const getRes = await makeRequest('GET', `/contacts/${testId}`);
    console.log('Status:', getRes.status);
    console.log('Contact:', JSON.parse(getRes.body).firstName);

    // Test POST
    console.log('\n=== POST new contact ===');
    const postData = JSON.stringify({
      firstName: 'TestUser',
      lastName: 'TestLast',
      email: 'test@test.com',
      favoriteColor: 'yellow',
      birthday: '2000-01-01'
    });
    const postRes = await makeRequest('POST', '/contacts', postData);
    console.log('Status:', postRes.status);
    const newId = JSON.parse(postRes.body).insertedId;
    console.log('New ID:', newId);

    // Test PUT
    console.log('\n=== PUT update contact ===');
    const putData = JSON.stringify({
      firstName: 'UpdatedName',
      favoriteColor: 'orange'
    });
    const putRes = await makeRequest('PUT', `/contacts/${newId}`, putData);
    console.log('Status:', putRes.status);

    // Verify PUT
    console.log('\n=== GET updated contact ===');
    const verifyRes = await makeRequest('GET', `/contacts/${newId}`);
    const updated = JSON.parse(verifyRes.body);
    console.log('Updated name:', updated.firstName);
    console.log('Updated color:', updated.favoriteColor);

    // Test DELETE
    console.log('\n=== DELETE contact ===');
    const delRes = await makeRequest('DELETE', `/contacts/${newId}`);
    console.log('Status:', delRes.status);

    // Verify DELETE
    console.log('\n=== GET deleted contact (should 404) ===');
    const verify404 = await makeRequest('GET', `/contacts/${newId}`);
    console.log('Status:', verify404.status);

    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runTests();
