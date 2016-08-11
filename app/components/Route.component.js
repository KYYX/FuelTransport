var _sites = {};

module.exports = {
  addPage: function (sites) {
    _sites = sites;
  },
  locateTo: function ($from, siteKey, params) {
    $from && $from.removeClass("show ready");

    var s = _sites[siteKey];

    s && s.init(params);
  }
}
