import Engine from '../components/Engine';

module.exports = {
    init: function () {
        $("#game").addClass("show");

        setTimeout(function () {
            $("#game").addClass("ready");

            setTimeout(function () {
                Engine.start();
            }, 500);
        }, 1000);
    }
};
