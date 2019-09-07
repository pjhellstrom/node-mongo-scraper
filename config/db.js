module.exports = {
  db:
    process.env.MONGODB_URI ||
    "mongodb://user1:password123@ds157667.mlab.com:57667/heroku_b9d4rq25"
};
