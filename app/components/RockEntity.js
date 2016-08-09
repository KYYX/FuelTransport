const SIZE = [0, 16, 22.6, 27,7, 32, 35.8];

function Rock (config) {
  var that = this;
  var size = Math.floor((config.weight - 1) / 10) + 1; // config.size;

  if (size > 8) {
    size = 8;
  }

  that.track    = config.track;
  that.speed    = config.speed;
  that.height   = config.height;
  that.width    = config.width;
  that.weight   = config.weight;
  that.size     = size;
  that.distance = config.distance;

  // that.node = $("<div class='rock'><div class='size" + that.size + "'></div></div>").css({
  //   top: 45 + (this.track - 1) * this.height,
  //   transform: "translateX(" + that.distance + "px)"
  // });
  //
  // $(".scroll").append(that.node);
}

Rock.prototype.get = function (attr) {
  return this[attr];
};

Rock.prototype.set = function (attr, value) {
  this[attr] = value;
};

// Rock.prototype.changeTrack = function (offset) {
//   this.track += offset;
//   this.node.css("top", 45 + (this.track - 1) * this.height);
// };

// Rock.prototype.changeSize = function (size) {
//   this.node.children("div").removeClass("size" + this.size).addClass("size" + size);
//   this.size = size;
// };

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
    a = friction / this.size;
  } else {
    a = friction / (Math.pow(this.size, 2) * Math.abs(this.speed));
  }

  this.speed += Math.round(a * 100 / 60) / 100;

  this.distance += Math.round(this.speed * 100 / 60) / 100;

  // this.node.css("transform", "translateX(" + that.distance + "px)");
};

Rock.prototype.render = function () {
  var style = "top:" + (45 + (this.track - 1) * this.height)
            + ";transform:translateX(" + this.distance + "px)";

  var node = this.node = $("<div class='rock' style='" + style + "'>" +
                " <div class='size" + this.size + "'></div>" +
                "</div>");

  $(".scroll").append(node);
};

module.exports = Rock;
