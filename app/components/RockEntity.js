const SIZE = [0, 16, 22.6, 27,7, 32, 35.8];

function Rock (config) {
  var that = this;
  var size = Math.floor((config.weight - 1) / 10) + 1; // config.level;

  if (size > 8) {
    size = 8;
  }

  that.track    = config.track;
  that.speed    = config.speed;
  that.height   = config.height;
  that.width    = config.width;
  that.weight   = config.weight;
  that.level    = size;
  that.distance = config.distance;
}

Rock.prototype.get = function (attr) {
  return this[attr];
};

Rock.prototype.set = function (attr, value) {
  this[attr] = value;
};

Rock.prototype.disappear = function () {
  this.node && this.node.addClass("disappear");
  this.status = "disappear";
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

  this.speed += Math.round(a * 100 / 60) / 100;
  this.distance += Math.round(this.speed * 100 / 60) / 100;
};

Rock.prototype.render = function () {
  var style = "top:" + (45 + (this.track - 1) * this.height) + "px;"
            + "transform:translateX(" + this.distance + "px)";

  var node = this.node 
           = $("<div class='rock' style='" + style + "'>" +
               " <div class='size" + this.level + "'></div>" +
               "</div>");

  $(".scroll").append(node);
};

module.exports = Rock;
