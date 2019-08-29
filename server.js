const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const expbs = require('express-handlebars');

const PORT = 3000;

// Start express
const app = express();

// Start handlebars engine
app.engine('handlebars', expbs());
app.set('view engine', 'handlebars');

// Serve static folder
// app.use(express.static('public'));

// Use morgan logger for logging requests
app.use(logger("dev"));

// Set middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Import routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", {
  useNewUrlParser: true
});

// Route to render handlebars
app.get('/', (req,res) => res.render('index'));

// Start server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
