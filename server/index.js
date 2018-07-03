// main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// db setup
mongoose.connect('mongodb://localhost/auth');

// app setup.
const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type : '*/*'}));

const router = require('./router');
router(app);

// server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port, () => {
    console.log('server listening on port ', port);
});

