import Engine from '../components/Engine';

var PAGE_ID = "#game";
var Plugins = {};

var $page = $(PAGE_ID);

var $arrivedDialog   = $("#game .cover.arrived");
var $exhaustedDialog = $("#game .cover.exhausted");
var $crashedDialog   = $("#game .cover.crashed");

//到达目的地，回城
$arrivedDialog.find(".option").tap(function () {
  var dest = "";

  $(".dest").each(function () {
    dest += "," + ($(this).html() || 0);
  });

  dest = dest.substring(1);

  KIM.position = dest;

  $arrivedDialog.hide();
  Plugins.route.locateTo($page, "main");
  Engine.reset();
});

//燃料耗尽后的选择
$exhaustedDialog.find(".option").tap(function () {
  $exhaustedDialog.hide();
});

//燃料耗尽，回城
$exhaustedDialog.find(".option.first").tap(function () {
  Plugins.route.locateTo($page, "main");
  Engine.reset();
});

//加燃料
$exhaustedDialog.find(".option.last").tap(function () {
  Engine.addFuel(3000).start();
});

//坠毁，回城
$crashedDialog.find(".option").tap(function () {
  $crashedDialog.hide();
  Plugins.route.locateTo($page, "main");
  Engine.reset();
});

module.exports = {
    init: function () {
        $page.addClass("show");
        var sceneHeight = $(".scene").height();
        var scale = sceneHeight / 270;

        $(".scale").css({
          "transform": "scale(" + scale + ")"
        });

        Engine.init({
          scale   :  scale,
          tracks  :  4,    //赛道数量
          distance:  999999, //赛道长度
        }, true);

        setTimeout(function () {
            $page.addClass("ready");
            // alert(window.innerWidth);
            setTimeout(function () {
              Engine.start();
            }, 1000);
        }, 100);
    },
    addPlugin: function (key, plugin) {
      Plugins[key] = plugin;
    }
};
