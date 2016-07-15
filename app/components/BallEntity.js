var createBallNode = function (color) {
  var wrap  = document.createElement('div');
  var inner = document.createElement('div');

   wrap.className = "rocket-wrap";
  inner.className = "rocket";
  inner.style.backgroundColor = color;

  wrap.appendChild(inner);

  return wrap;
};

function BallEntity (color, offsetX, offsetY) {
  var node = this.node = createBallNode(color);

  this.setOffsetX(offsetX);
  this.setOffsetY(offsetY);

  document.querySelector('.scroll').appendChild(node);
}

BallEntity.prototype.setOffsetY = function (offsetY) {
  this.translateY = offsetY;
  this.node.style.top = offsetY + "px";
};

BallEntity.prototype.setOffsetX = function (offsetX) {
  this.translateX = offsetX;
  this.node.style.transform = "translateX(" + offsetX + "px)";
};

module.exports = BallEntity;
