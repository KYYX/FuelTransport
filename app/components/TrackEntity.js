module.exports = (function () {
  var trackOffsetX = 0;  //地图滚动的距离
  var maxOffsetX;
  var $map;
  var $tracks;

  return {
    /**
     * @param {number} distance - 轨道距离
     * @param {number} tracks - 轨道数量
     * @param {number} scale - 缩放系数
     */
    init: function (distance, tracks, scale) {
      trackOffsetX = 0;
      maxOffsetX = distance - window.innerWidth / scale;

      $map    = $('#track');
      $tracks = $('.tracks');

      $map.width(distance)
          .addClass('track-' + tracks)
          .css("transform", "translateX(" + trackOffsetX + "px)");

      $tracks.empty()
             .width(distance)
             .css("transform", "translateX(" + trackOffsetX + "px)");

      for (var i=0; i<tracks; i++) {
         $tracks.append('<div class="track" style="height:' + (180 / tracks) + 'px"></div>');
      }
    },
    update: function (myRollOffsetX, speed) {
      if (Math.abs(myRollOffsetX) < 73 || Math.abs(trackOffsetX) === maxOffsetX) {
        /* 屏幕不动 */
      } else {
        trackOffsetX -= speed / window.cfg.FRAMES;

        if (trackOffsetX < 0 - maxOffsetX) {
          trackOffsetX = 0 - maxOffsetX;
        } else if (trackOffsetX > 0) {
          trackOffsetX = 0;
        } else { }

        $map.css("transform", "translateX(" + trackOffsetX + "px)");
        $tracks.css("transform", "translateX(" + trackOffsetX + "px)");
      }
    }
  };
})()
