const http = require('http');

// Test POST endpoint
const data = JSON.stringify({
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice@example.com',
  favoriteColor: 'pink',
  birthday: '1995-03-10'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/contacts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('POST Response Status:', res.statusCode);
    console.log('POST Response Body:', body);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();
