require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello again');
});

app.get('/goodbye', (req, res) => {
  res.send('Sayonara baby');
});

app.listen(process.env.PORT, () => {
  console.log('Listening at port: ', process.env);
});
