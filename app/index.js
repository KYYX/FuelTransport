import Route    from "./components/Route.component";
import MainPage from './pages/Main.page';
import MapPage  from './pages/Map.page';
import GamePage from './pages/Game.page';

import AccountsCfg from './configs/AccountsCfg';

var KIM = window.KIM = AccountsCfg.i89757;

for (var i=0; i<KIM.rockets.length; i++) {
  if (KIM.rockets[i].checked) {
    KIM.rocket = KIM.rockets[i];
    break;
  }
}

var pages = {
  main: MainPage,
  map:  MapPage,
  game: GamePage
};

Route.addPage(pages);

for (var key in pages) {
  pages[key].addPlugin("route", Route);
}

window.onload = function () {
    Route.locateTo(null, "main");
}
