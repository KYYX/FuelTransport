import Route from "./components/Route.component";

import CreatePage from "./pages/00_Create.page";
import   MainPage from './pages/01_Main.page';
import    MapPage from './pages/Map.page';
import   GamePage from './pages/Game.page';
import   TestPage from './pages/04_Test.page';

import   GlobalCfg from './configs/GlobalCfg';
// import AccountsCfg from './configs/AccountsCfg';

window.cfg = GlobalCfg;
// var KIM = window.KIM = AccountsCfg.i89757;
//
// for (var i=0; i<KIM.rockets.length; i++) {
//   if (KIM.rockets[i].checked) {
//     KIM.rocket = KIM.rockets[i];
//     break;
//   }
// }

var pages = {
  create: CreatePage,
  main  :   MainPage,
  map   :    MapPage,
  game  :   GamePage,
  test  :   TestPage
};

Route.addPage(pages);

for (var key in pages) {
  pages[key].addPlugin("route", Route);
}

window.addEventListener('load', function () {
// document.addEventListener('deviceready', function () {
  var KIM = window.localStorage.getItem("i89757");
  if (KIM) {
    window.KIM = JSON.parse(KIM);
    Route.locateTo(null, "main");
  } else {
    Route.locateTo(null, "create");
  }
}, false);
