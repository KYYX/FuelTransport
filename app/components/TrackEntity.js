var TrackEntity = (function () {
  var _Track;

  function _TrackEntity (config) {
    if (_Track) {
      console.warn('TrackEntity is a singleton');
      return _Track;
    } else {
      _Track = this;

      var screenWidth = window.innerWidth;
      var distance = config.distance;
      var tracks = config.tracks;
      var trackOffsetX = 0;  //地图滚动的距离
      var $trackNode = $('#track');
      var $tracksNode = $('.tracks');

      $trackNode.width(distance).addClass('track-' + tracks);

      for (var i=0; i<tracks; i++) {
         $tracksNode.append('<div class="track"></div>');
      }

      $trackNode.swipeUp(function () {
        _Track.MyRoll.setTranslateY(-1);
        // config.callback(-1);
      });

      $trackNode.swipeDown(function () {
        _Track.MyRoll.setTranslateY(1);
        // config.callback(1);
      });

      this.update = function (myRollOffsetX, speed) {
        if (Math.abs(myRollOffsetX) < 73) {
          /* 当球体滚动64px再开始滚动地图 */
        } else if (Math.abs(myRollOffsetX) < distance - screenWidth ) {
          trackOffsetX -= speed / 60;
          // scrollNode.style.transform = "translateX(" + trackOffsetX + "px)";
          $trackNode.css("transform", "translateX(" + trackOffsetX + "px)")
        } else {
          /* 地图达到最大距离，停止滚动 */
        }
      };

      this.loadMyRoll = function (roll) {
        _Track.MyRoll = roll;
      };
    }
  }

  return _TrackEntity;
})()
