var PAGE_ID = "#main";
var Plugins = {};

var $page = $(PAGE_ID);

var setAttr = function (rocket) {
  var rocketLevel = Math.floor((rocket.level - 1) / 10);
  var rocketModel = rocket.level % 11;

  $(".attr-rocket-level").html(LEVEL[rocketLevel]);
  $(".attr-rocket-model").html(MODEL[rocketModel]);

  for (var key in rocket) {
    if (key !== "level") {
      var value = typeof rocket[key] === "string" ? rocket[key] : Math.round(rocket[key]);
      $(".attr-rocket-" + key).html(value);
    }
  }
};

$page.find("[data-location]").tap(function () {
  var location = $(this).data("location");

  Plugins.route.locateTo($page, location);
});

module.exports = {
  init: function () {
    $page.addClass("show");

    setAttr(KIM.rocket);

    setTimeout(function () {
        $page.addClass("ready");
    }, 100);
  },
  addPlugin: function (key, plugin) {
    Plugins[key] = plugin;
  }
};
