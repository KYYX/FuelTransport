import Engine from '../components/Engine';

var PAGE_ID = "#game";
var Plugins = {};

var $page = $(PAGE_ID);

var $arrivedDialog   = $(".cover.arrived");
var $exhaustedDialog = $(".cover.exhausted");
var $crashedDialog   = $(".cover.crashed");

$arrivedDialog.find(".option").tap(function () {
  var dest = "";

  $(".dest").each(function () {
    dest += "," + ($(this).html() || 0);
  });

  dest = dest.substring(1);

  KIM.position = dest;

  Plugins.route.locateTo($page, "main");
});

$exhaustedDialog.find(".option.first").tap(function () {
  Plugins.route.locateTo($page, "main");
});

//加燃料
$exhaustedDialog.find(".option.last").tap(function () {
  Engine.addFuel(3000);

  $exhaustedDialog.hide();

  Engine.start();
});

$crashedDialog.find(".option").tap(function () {
  Plugins.route.locateTo($page, "main");
});

module.exports = {
    init: function (distance) {
        $page.addClass("show");
        var sceneHeight = $(".scene").height();
        var scale = sceneHeight / 270;

        TrackCfg.scale = scale;
        TrackCfg.distance = distance;

        $(".scale").css({
          "transform": "scale(" + scale + ")"
        });

        Engine.init(TrackCfg);

        setTimeout(function () {
            $page.addClass("ready");
            setTimeout(function () {
              Engine.start();
            }, 1000);
        }, 100);
    },
    addPlugin: function (key, plugin) {
      Plugins[key] = plugin;
    }
};
