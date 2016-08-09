module.exports = (function () {
  var MyRobot;
  var screenWidth;
  var trackOffsetX = 0;  //地图滚动的距离
  var maxOffsetX;
  var tracks;
  var _scale;
  var $map;
  var $tracks;

  return {
    init: function (_distance, _tracks, Robot, scale) {
      _scale = scale;

      var trackHeight = 180 / _tracks;

      MyRobot = Robot;
      maxOffsetX = _distance - window.innerWidth / scale;
      tracks = _tracks;

      $map    = $('#track');
      $tracks = $('.tracks');

      $map.width(_distance).addClass('track-' + tracks);
      $tracks.width(_distance);

      for (var i=0; i<tracks; i++) {
         $tracks.append('<div class="track" style="height:' + trackHeight + 'px"></div>');
      }
    },
    update: function (myRollOffsetX, speed) {
      if (Math.abs(myRollOffsetX) < 73 || Math.abs(trackOffsetX) === maxOffsetX) {
        /* 屏幕不动 */
      } else {
        trackOffsetX -= speed / 60;

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
