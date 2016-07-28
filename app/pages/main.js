import GamePage from "./Game.page";

module.exports = {
    init: function () {
        $("#main").on('tap', '[data-location]', function () {
            var location = $(this).data("location");

            $("#main").removeClass("show ready");

            if (location === "game") {
                GamePage.init();
            }
        });
    }
};
