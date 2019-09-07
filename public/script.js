$(document).ready(function() {
  // Scrape button click listener
  $(".scrape").click(function() {
    $.get("/scrape", function(req, res) {
      console.log(res);
    }).then(function(data) {
      window.location.href = "/";
    });
  });

  // Home button click listener
  $(".home").click(function() {
    $.get("/", function(req, res) {
      console.log(res);
    }).then(function(data) {
      window.location.href = "/";
    });
  });

  // Save button click listener
  $(".saveBtn").click(function(e) {
    $(this)
      .parent()
      .remove();
    const articleId = $(this).attr("data-id");
    $.ajax({
      url: "/save/" + articleId,
      type: "POST"
    }).done(function(data) {
      $(".article")
        .filter(`[data-id="${articleId}"]`)
        .remove();
    });
  });

  // Go to Saved button click listener
  $(".toSaved").click(function() {
    $.get("/saved", function(req, res) {
      console.log(res);
    }).then(function(data) {
      window.location.href = "/saved";
    });
  });

  // Delete button click listener
  $(".delete").click(function() {
    $(this)
      .parent()
      .remove();
    const articleId = $(this).attr("data-id");
    $.ajax({
      url: "/delete/" + articleId,
      type: "POST"
    }).done(function(data) {
      $(".article")
        .filter(`[data-id="${articleId}"]`)
        .remove();
    });
  });
});
