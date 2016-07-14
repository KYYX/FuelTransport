var createBallNode = function (color) {
  var wrap  = document.createElement('div');
  var inner = document.createElement('div');

   wrap.className = "rocket-wrap";
  inner.className = "rocket";
  inner.style.backgroundColor = color;

  wrap.appendChild(inner);

  return wrap;
};

var setNodePosition = function (node, x, y) {
  node.style.transform = "translate(" + x + "px, " + y * 100 + "%)";
}

function BallEntity (config) {
  this.translateX = config.x;
  this.translateY = config.y;

  var node = this.node = createBallNode(config.color);

  setNodePosition(node, this.translateX, this.translateY)

  document.querySelector('.scroll').appendChild(node);
}

BallEntity.prototype.setTranslateY = function (translateY) {
  this.translateY = translateY;
  setNodePosition(this.node, this.translateX, this.translateY);
};

BallEntity.prototype.setTranslateX = function (setTranslateX) {
  this.translateX = setTranslateX;
  setNodePosition(this.node, this.translateX, this.translateY);
};

module.exports = BallEntity;
