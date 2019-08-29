// Import models
const db = require('../models');

module.exports = function (app) {

  // Root route gets the posts saved in DB
  app.get("/", function (req, res) {
    db.Post.find({}).then((dbPost) => {
        console.log(dbPost);
        res.render("index", { data: dbPost, home: true });
    }).catch( (err) => console.log(err));
  });

}
