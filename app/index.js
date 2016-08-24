import Route from "./components/Route.component";

import CreatePage from "./pages/00_Create.page";
import   MainPage from './pages/01_Main.page';
import    MapPage from './pages/02_Map.page';
import   GamePage from './pages/03_Game.page';
import   TestPage from './pages/04_Test.page';
import  GlobalCfg from './configs/GlobalCfg';

window.cfg = GlobalCfg;

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
  if (false) {
    var My = window.KIM = JSON.parse(KIM);
    // var Rocket = My.rocket;
    // var equipment = Rocket.equipment;
    //
    // equipment.forEach(function (data, index) {
    //   Rocket.weight += data.weight;
    //
    //   if (data.type === 1) {
    //     Rocket.PF += data.power;
    //   } else if (data.type === 2) {
    //     Rocket.BF += data.power;
    //   } else if (data.type === 3) {
    //     Rocket.MaxHP += data.MaxHP;
    //     Rocket.HP += data.HP;
    //   } else if (data.type === 4) {
    //     Rocket.MaxMP += data.MaxMP;
    //     Rocket.MP += data.MP;
    //   } else {
    //
    //   }
    // });

    Route.locateTo(null, "main");
  } else {
    Route.locateTo(null, "create");
  }
}, false);
