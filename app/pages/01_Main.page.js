var Plugins = {};

var $page  = $("#main");
var $name  = $page.find(".attr-rocket-name");
var $level = $page.find(".attr-rocket-level");
var $HP    = $page.find("span.shield");
var $MP    = $page.find("span.fuel");
var $quip  = $page.find(".equipment");
var $first = $page.find(".equipment-first");
var $last  = $page.find(".equipment-last");

var attrs = ["推进力", "制动力", "防御", "续航", "负载", "能耗"];
var ctx = document.getElementById("main-canvas").getContext("2d");
// ctx.globalCompositeOperation = "source-atop";

var R = 64;

var setAttr = function (rocket) {
  // var rocketLevel = Math.floor((rocket.level - 1) / 10);
  // var rocketModel = rocket.level % 11;
  //
  $name.html(rocket.name);
  $level.html(rocket.level + " 级");

  $HP.width(Math.round(rocket.HP / rocket.MaxHP * 100) + "%");
  $MP.width(Math.round(rocket.MP / rocket.MaxMP * 100) + "%");
};

var setEquipment = function (rocket) {
  var equipments = rocket.equipment;

  rocket.weight = 100;
  rocket.PF = 0;
  rocket.BF = 0;
  rocket.MaxHP = 0;
  rocket.HP = 0;
  rocket.MaxMP = 0;
  rocket.MP = 0;

  $first.empty();
  $last.empty();

  for (var i=0; i<10; i++) {
    var $div;

    if (equipments[i]) {
      var equipment = equipments[i];
      var name;

      rocket.weight += equipment.weight;

      if (equipment.type === 1) {
        name = "加速器";
        rocket.PF += equipment.power;
      } else if (equipment.type === 2) {
        name = "制动器";
        rocket.BF += equipment.power;
      } else if (equipment.type === 3) {
        name = "能量罩";
        rocket.MaxHP += equipment.MaxHP;
        rocket.HP += equipment.HP;
      } else if (equipment.type === 4) {
        name = "燃料箱";
        rocket.MaxMP += equipment.MaxMP;
        rocket.MP += equipment.MP;
      } else {
        name = "其他";
      }

      $div = $("<div><div></div><p>" + name + "</p></div>");
    } else {
      $div = $("<div><div></div><p>空</p></div>");
    }

    if (i<5) {
      $first.append($div);
    } else {
      $last.append($div);
    }
  }
};

var drawHexagon = function (r) {
  ctx.beginPath();
  ctx.moveTo(0, 0 - R + 2);

  [0,1,2,3,4,5,6].forEach(function (num) {
    ctx.save();
    ctx.rotate(num * 60 * Math.PI / 180);
    ctx.lineTo(0, 0 - r);
    ctx.restore();
  });
};

var drawHexagon2 = function (percents) {
  ctx.beginPath();
  ctx.moveTo(0, 0 - percents[0] * R);

  [0,1,2,3,4,5].forEach(function (num, index) {
    ctx.save();
    ctx.rotate(num * 60 * Math.PI / 180);
    ctx.lineTo(0, 0 - percents[index] * R);
    ctx.restore();
  });

  ctx.closePath();
}

var drawChart = function (rocket) {
  ctx.font = "12px 微软雅黑";
  ctx.fillStyle = "rgba(0,255,00,.5)";
  ctx.strokeStyle = "#aaa";

  ctx.clearRect(0,0,195,195);

  ctx.translate(97,97);

  //外圈圆
  // ctx.arc(0, 0, R, 0, 2*Math.PI);
  // ctx.stroke();

  // ctx.clip();
  ctx.save(); //存储遮罩区域

  //画伞骨
  [0,1,2,3,4,5].forEach(function (num, index) {
    ctx.save();
    // ctx.strokeStyle = "yellow";
    ctx.rotate(num * 60 * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 0 - R);
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.fillText(attrs[index], -12, 0 - R - 8);
    ctx.restore();
  });

  //画辅助六边形
  // [1,2,3,4,5,6,7,8,9,10].forEach(function (num) {
  [2,4,6,8,10].forEach(function (num) {
    drawHexagon(R / 10 * num);
    ctx.stroke();
  });

  drawHexagon(R);
  drawHexagon2([
                rocket.PF / 10000,
                rocket.BF / 10000,
                rocket.HP / 10000,
                rocket.MP / 10000,
                0,
                0.5,
              ]);
  ctx.fill();
  ctx.setTransform(1,0,0,1,0,0);
};

$page.find("[data-location]").tap(function () {
  var location = $(this).data("location");

  Plugins.route.locateTo($page, location);
});

module.exports = {
  init: function () {
    var rocket = KIM.rocket;

    $page.addClass("show");

    setEquipment(rocket);
    setAttr(rocket);
    drawChart(rocket);

    setTimeout(function () {
        $page.addClass("ready");
    }, 100);
  },
  addPlugin: function (key, plugin) {
    Plugins[key] = plugin;
  }
};
