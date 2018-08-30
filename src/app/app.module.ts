import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { IonicStorageModule } from "@ionic/storage";
import { HttpModule } from "@angular/http";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { ListPage } from "../pages/list/list";
import { StatsPage } from "../pages/stats/stats";
import { SettingsPage } from "../pages/settings/settings";
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { StatusBar } from "@ionic-native/status-bar";
import { Settings } from "../providers/settings";

var config = {
  apiKey: "AIzaSyBuLGQk2EB7DMdPqkbf8WoB4yX5TxhCJTs",
  authDomain: "gaston-ad55f.firebaseapp.com",
  databaseURL: "https://gaston-ad55f.firebaseio.com",
  projectId: "gaston-ad55f",
  storageBucket: "",
  messagingSenderId: "1022658026662"
};

@NgModule({
  declarations: [MyApp, HomePage, ListPage, StatsPage, SettingsPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, ListPage, StatsPage, SettingsPage],
  providers: [StatusBar, { provide: ErrorHandler, useClass: IonicErrorHandler },
    Settings]
})
export class AppModule {}
