module.exports = (function () {
  var trackOffsetX = 0;  //地图滚动的距离
  var maxOffsetX;
  var $map = $('#game .map');

  return {
    /**
     * @param {number} distance - 轨道距离
     * @param {number} scale - 缩放系数
     */
    init: function (distance, scale) {
      trackOffsetX = 0;
      maxOffsetX = distance - window.innerWidth / scale;

      // $map = $('#game .map');
      // $tracks = $('.tracks');
      $map.width(distance)
          .css("transform", "translateX(" + trackOffsetX + "px)");
    },
    update: function (myDistance, speed) {
      if (Math.abs(myDistance) < 73 || Math.abs(trackOffsetX) === maxOffsetX) {
        /* 屏幕不动 */
      } else {
        trackOffsetX -= speed / window.cfg.FRAMES;

        if (trackOffsetX < 0 - maxOffsetX) {
          trackOffsetX = 0 - maxOffsetX;
        } else if (trackOffsetX > 0) {
          trackOffsetX = 0;
        } else { }

        $map.css("transform", "translateX(" + trackOffsetX + "px)");
        // $tracks.css("transform", "translateX(" + trackOffsetX + "px)");
      }
    }
  };
})()
