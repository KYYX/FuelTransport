var PAGE_ID = "#page-map";
var Plugins = {};
var distance;

var getPosition = function (points) {
  var position = 0;

  points = points.split(",");

  points.forEach(function (point, index) {
    position += point * Math.pow(10, 3 - index);
  });

  return position;
};

var $page = $(PAGE_ID);
var $forward = $page.find(".forward");
var $ul = $page.find("ul");

$page.find(".dest").tap(function () {
  $page.find(".dest.focus").removeClass("focus");
  $(this).addClass("focus");
  $ul.removeClass("disabled");

  return false;
});

$page.find("li").tap(function () {
  var $this = $(this);

  if (!$this.parent().hasClass("disabled")) {
    $page.find(".focus").html($this.html());

    var dest = "";

    $(".dest").each(function () {
      dest += "," + ($(this).html() || 0);
    });

    dest = dest.substring(1);

    distance = Math.abs(getPosition(KIM.position) - getPosition(dest));

    if (distance === 0) {
      $forward.addClass("disabled");
    } else {
      $forward.removeClass("disabled");
    }
  }
});

$page.tap(function () {
  $page.find(".focus").removeClass("focus");
  $ul.addClass("disabled");
});

// $page.find(".button").tap(function () {
//   if ($(this).hasClass("disabled")) {
//
//   } else {
//     $page.removeClass("show ready");
//   }
// });

//前进
$forward.tap(function () {
  if ($(this).hasClass("disabled")) {
    alert("目的地不能相同");
  } else {
    Plugins.route.locateTo($page, "game", distance * 1000);
  }
});

//返回
$page.find(".back").tap(function () {
  Plugins.route.locateTo($page, "main");
});

module.exports = {
    init: function () {
        $forward.addClass("disabled");
        $page.addClass("show");

        setTimeout(function () {
            $page.addClass("ready");
        }, 100);
    },
    addPlugin: function (key, plugin) {
      Plugins[key] = plugin;
    }
};
