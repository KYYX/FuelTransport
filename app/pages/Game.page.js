import Engine from '../components/Engine';

module.exports = {
    init: function () {
        $("#game").addClass("show");
        var sceneHeight = $(".scene").height();
        var scale = sceneHeight / 270;

        $(".scale").css({
          "transform": "scale(" + scale + ")"
        });

        Engine.init(scale);

        setTimeout(function () {
            $("#game").addClass("ready");
            setTimeout(function () {
              Engine.start();
            }, 1000);
        }, 500);
    }
};
