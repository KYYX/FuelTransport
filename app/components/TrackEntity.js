module.exports = (function () {
  var MyRobot;
  var screenWidth  = window.innerWidth;
  var trackOffsetX = 0;  //地图滚动的距离
  var distance;
  var tracks;
  var $trackNode;
  var $tracksNode;

  return {
    init: function (_distance, _tracks, Robot) {
      MyRobot = Robot;

      distance = _distance;
      tracks = _tracks;

      $trackNode   = $('#track');
      $tracksNode  = $('.tracks');

      $trackNode.width(distance).addClass('track-' + tracks);

      $trackNode.swipeUp(function () {
        MyRobot.setTranslateY(-1);
      });

      $trackNode.swipeDown(function () {
        MyRobot.setTranslateY(1);
      });

      for (var i=0; i<tracks; i++) {
         $tracksNode.append('<div class="track"></div>');
      }
    },
    update: function (myRollOffsetX, speed) {
      if (Math.abs(myRollOffsetX) < 73) {
        /* 当球体滚动64px再开始滚动地图 */
      } else if (Math.abs(myRollOffsetX) < distance - screenWidth ) {
        trackOffsetX -= speed / 60;
        $trackNode.css("transform", "translateX(" + trackOffsetX + "px)")
        // scrollNode.style.transform = "translateX(" + trackOffsetX + "px)";
      } else {
        /* 地图达到最大距离，停止滚动 */
      }
    }
  };
})()
