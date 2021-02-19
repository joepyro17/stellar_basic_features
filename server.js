const express = require('express');
const bodyParser = require('body-parser');
const router = require('./app/routers/api');
const db = require('./app/config/database');

const app = express();

// Create a connection with MongoDB
db.createConnection();

// Configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Routing
app.use(router);

module.exports = app;
