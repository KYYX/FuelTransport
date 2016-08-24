var Plugins = {};
var _name;
var $page = $("#page-create");
var $button = $page.find(".page-button");
var inputNode = document.querySelector("#page-create input");

inputNode.addEventListener("input", function () {
  if (!!this.value) {
    _name = this.value;
    $button.removeClass("disabled");
  } else {
    $button.addClass("disabled");
  }
});

inputNode.addEventListener("blur", function () {
  StatusBar.hide();
});

$button.tap(function () {
  var $this = $(this);

  if ($this.hasClass("disabled")) {

  } else {
    var account = {
      ID: "89757",
      name: "这个目前不重要",
      money: 0,
      diamond: 0,
      position: "0,0,0,0",
      rocket: {
        name: _name,
        level: "D",
        weight: 100,
        PF: 0,
        BF: 0,
        HP: 0,
        MaxHP: 0,
        MP: 0,
        MaxMP: 0,
        equipment: [{
          type: 1,
          weight: 10,
          name: "正向推进器",
          power: 1000,
          cost: 1
        },{
          type: 2,
          weight: 10,
          name: "逆向制动器",
          power: 1000,
          cost: 1
        },{
          type: 3,
          weight: 10,
          name: "能量罩",
          MaxHP: 10000,
          HP: 10000

        },{
          type: 4,
          weight: 10,
          name: "燃料舱",
          MaxMP: 10000,
          MP: 10000
        }]
      }
    };

    localStorage.setItem("i89757", JSON.stringify(account));
    window.KIM = account;

    Plugins.route.locateTo($page, "main");
  }
});

module.exports = {
  init: function () {
    $page.addClass("show");

    setTimeout(function () {
        $page.addClass("ready");
    }, 100);
  },
  addPlugin: function (key, plugin) {
    Plugins[key] = plugin;
  }
};
