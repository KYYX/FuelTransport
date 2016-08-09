import GamePage from "./Game.page";

module.exports = {
  init: function () {
    $("[data-location]").tap(function () {
        var location = $(this).data("location");

        $("#main").removeClass("show ready");

        if (location === "game") {
            GamePage.init();
        }
    });
  }
};
