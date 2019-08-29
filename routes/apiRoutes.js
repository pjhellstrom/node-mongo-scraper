const axios = require('axios');
const cheerio = require('cheerio');
// Import models
const db = require('../models');

module.exports = function (app) {

// Route for scraping
app.get("/scrape", (req, res) => {
  // Make a request via axios to grab the HTML body from the site of your choice
  axios.get("https://techcrunch.com/").then(function(response) {

    // Load html into cheerio
    const $ = cheerio.load(response.data);

    $("a.post-block__title__link").each(function(i, element) {
      const result = {};

      result.title= $(element).text().trim();
      result.body = $(element).parents().children("div.post-block__content").text().trim();
      result.url = $(element).parents().children("a.post-block__title__link").attr("href");
      result.image = $(element).parents().children("source").attr("media");

      // Creates new post from each result in scraper
      db.Post.create(result)
        .then((dbPost) => console.log(dbPost))
        .catch((err) => console.log(err));
      });
    });

    res.redirect(200, '/');
});

// Route for fetching all posts
app.get('/posts', (req, res) => {
  db.Post.find({})
    .then((dbPost) => res.json(dbPost))
    .catch((err) => console.log(err));
});

// Route for fetching one post
app.get("/posts/:id", (req, res) => {
  db.Post.findOne({ _id: req.params.id })
    .populate('comment')
    .then((dbPost) => res.json(dbPost))
    .catch((err) => console.log(err));
});

// // Route for posting a comment on a post
// app.post('/posts/:id', (req, res) => {
//   console.log("commentBody: ", req.body);
//   const newComment = new Comment({
//     commentbody: req.body.text,
//     post: req.params.id
//   });
//   db.newComment.save({
//     db.Post.findOneAndUpdate({

// })
//   })
// })

// // Route for updating one post in db
// app.get("/posts/:id", (req, res) => {
//   db.Post.create(req.body)
//     .then((dbPost) => db.Post.findOneAndUpdate(
//       { _id: req.params.id }, { note: dbPost._id }, { new: true }))
//     .then((dbPost) => res.json(dbPost))
//     .catch((err) => console.log(err));
// });
}
