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
        level: 1,
        weight: 100,
        durability1: 1000,  //最大耐久
        durability2: 1000,  //当前耐久
        power:   1000,
        braking: 1000,
        fuel1: 10000,  //最大能源
        fuel2: 10000,  //当前能源
        cost:  1
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
