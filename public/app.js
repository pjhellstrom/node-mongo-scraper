$(document).ready(() => {
  $("#scrape-btn").on('click', () => {
    console.log("Scraping");
    $.ajax({
      type: "GET",
      url: "/scrape",
    }).then( () => {
      location.reload()
    })
  })
});
