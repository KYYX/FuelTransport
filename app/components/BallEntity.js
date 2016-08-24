function BallEntity () {
  var node = this.node = document.createElement('div');

  node.className = "rocket";

  this.track = 2;
  this.changeTrack();

  document.querySelector('#game .map').appendChild(node);
}

BallEntity.prototype.changeTrack = function () {
  var track = this.track;
  this.node.style.top = (5 + (track - 1) + 48 * (track - 1)) + "px";
};

BallEntity.prototype.up = function (offsetY) {
  this.track -= 1;

  if (this.track === 0) {
    this.track = 1;
  }

  this.changeTrack();

  return this.track;
};

BallEntity.prototype.down = function (offsetX) {
  this.track += 1;

  if (this.track === 4) {
    this.track = 3;
  }

  this.changeTrack();

  return this.track;
};

BallEntity.prototype.move = function (offsetX) {
  this.node.style.transform = "translateX(" + offsetX + "px)";
};

module.exports = BallEntity;
