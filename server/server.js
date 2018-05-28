const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('../config');
const port = config.port;

const app = express();
const router = express.Router();

const publicPath = path.join(__dirname, '../public');

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static(publicPath));

app.use('/', router);

console.log(publicPath);
