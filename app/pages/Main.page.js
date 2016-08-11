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
      $(".attr-rocket-" + key).html(rocket[key]);
    }
  }
};

var setPosition = function (position) {
  var _points = position.split(",");

  _points.forEach(function (point, index) {
    $(".attr-position-src-"  + (index + 1)).html(point);
    $(".attr-position-dest-" + (index + 1)).html(point);
  });
}

$page.find("[data-location]").tap(function () {
  var location = $(this).data("location");

  // $page.removeClass("show ready");
  Plugins.route.locateTo($page, location);
});

module.exports = {
  init: function () {
    $page.addClass("show");

    setAttr(KIM.rocket);
    setPosition(KIM.position);

    setTimeout(function () {
        $page.addClass("ready");
    }, 100);
  },
  addPlugin: function (key, plugin) {
    Plugins[key] = plugin;
  }
};
