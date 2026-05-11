const express = require('express');
const payload = require('payload');
const path = require('path');

const app = express();

const start = async () => {
  await payload.init({
    secret: 'mysecretkey123',
    express: app,
    config: path.join(__dirname, 'src', 'payload.config.js'),
    onInit: () => {
      console.log('Payload Admin URL: http://localhost:5000/admin');
    },
  });

  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
};

start();