const SIZE = [0, 16, 22.6, 27,7, 32, 35.8];

function Rock (config) {
  var that = this;
  var size = Math.floor((config.weight - 1) / 10) + 1; // config.level;

  if (size > 8) {
    size = 8;
  }

  that.track = config.track;
  that.speed = config.speed;
  that.level = Math.floor(Math.random() * 4) + 1;
  that.weight = that.level * 10;
  that.distance = config.distance;
}

Rock.prototype.type = "Rock";

Rock.prototype.get = function (attr) {
  return this[attr];
};

Rock.prototype.set = function (attr, value) {
  this[attr] = value;
};

Rock.prototype.disappear = function () {
  if (this.node) {
    this.node.className += " disappear";
  }
  this.status = "disappear";
};

Rock.prototype.invoke = function () {
  this.status = "active";
};

Rock.prototype.remove = function () {
  this.node.remove();
};

Rock.prototype.show = function () {
  this.node.show();
};

Rock.prototype.hide = function () {
  this.node.hide();
}

Rock.prototype.update = function (friction) {
  var that  = this;
  var speed = this.speed;
  var a;

  if (friction === 0) {
    a = 0;
  } else if (speed === 0) {
    a = friction / this.level;
  } else {
    a = friction / (Math.pow(this.level, 2) * Math.abs(this.speed));
  }

  this.speed += Math.round(a * 100 / window.cfg.FRAMES) / 100;
  this.distance += Math.round(this.speed * 100 / window.cfg.FRAMES) / 100;
};

Rock.prototype.render = function () {
  // var style = "top:" + (45 + (this.track - 1) * this.height) + "px;"
  //           + "transform:translateX(" + this.distance + "px)";
  this.node = document.createElement("div");
  this.node.className = "rock size" + this.level;
  this.node.style.top = (5 + (this.track - 1) + 48 * (this.track - 1)) + "px";
  // this.node.style.transform = "translateX(" + this.distance + "px)";
  this.node.style.left = this.distance + "px";

  // var node = this.node
  //          = $("<div class='rock' style='" + style + "'>" +
  //              " <div class='size" + this.level + "'></div>" +
  //              "</div>");

  // $("#game .map").append(node);
  document.querySelector('#game .map').appendChild(this.node);
};

module.exports = Rock;
