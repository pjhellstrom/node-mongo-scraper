const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const hbs = require("handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

// Create express server
const app = express();

// Middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static folder
app.use(express.static(process.cwd() + "/public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Handlebars each_upto helper
hbs.registerHelper("each_upto", function(ary, max, options) {
  if (!ary || ary.length == 0) return options.inverse(this);

  let result = [];
  for (let i = 0; i < max && i < ary.length; ++i)
    result.push(options.fn(ary[i]));
  return result.join("");
});

const PORT = process.env.PORT || 3000;
mongoose.Promise = Promise;

// database connection
const config = require("./config/db");

mongoose
  .connect(config.db, { useNewUrlParser: true })
  .then(res => {
    console.log(
      `Connected to database '${res.connections[0].name}' on ${res.connections[0].host}:${res.connections[0].port}`
    );
  })
  .catch(err => {
    console.log("Database Connection Error: ", err);
  });

// ROUTING ====================================================================

// Route for fetching saved articles
app.get("/", function(req, res) {
  db.Article.find({ saved: false })
    .then(function(dbArticle) {
      let hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for scraping
app.get("/scrape", (req, res) => {
  // Make a request via axios to grab the HTML body from the site of your choice
  axios.get("https://techcrunch.com/").then(function(response) {
    // Load html into cheerio
    const $ = cheerio.load(response.data);

    $("a.post-block__title__link").each(function(i, element) {
      const result = {};

      result.title = $(element)
        .text()
        .trim();
      result.summary = $(element)
        .parents()
        .children("div.post-block__content")
        .text()
        .trim();
      result.link = $(element)
        .parents()
        .children("a.post-block__title__link")
        .attr("href");
      result.image = $(element)
        .parents()
        .children("source")
        .attr("media");
      result.saved = false;

      // Creates new post from each result in scraper and saves to DB
      db.Article.create(result)
        .then(dbPost => console.log(dbPost))
        .catch(err => console.log(err));
    });
  });
});

// Saved articles page - fetch articles flagged with 'saved'
app.get("/saved", (req, res) => {
  db.Article.find({ saved: true })
    .then(function(dbArticles) {
      var hbsObject = {
        articles: dbArticles
      };
      res.render("saved", hbsObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Add article to saved articles page
app.post("/save/:id", (req, res) => {
  db.Article.update({ _id: req.params.id }, { $set: { saved: true } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Remove article from saved articles page
app.post("/delete/:id", (req, res) => {
  db.Article.update({ _id: req.params.id }, { $set: { saved: false } })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Init server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
