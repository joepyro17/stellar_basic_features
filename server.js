const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const routerApi = require('./app/routers/api');
const routerAuth = require('./app/routers/auth');
const db = require('./app/config/database');

require('./app/auth/auth');

const app = express();

// Create a connection with MongoDB
db.createConnection();

// Configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Routing
app.use('/api', passport.authenticate('jwt', { session: false }), routerApi);
app.use('/auth', routerAuth);

module.exports = app;
