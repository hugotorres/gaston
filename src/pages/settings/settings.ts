import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AngularFireModule } from "angularfire2";

import { ToastController } from "ionic-angular";
import {
  AngularFireDatabase,
  FirebaseListObservable
} from "angularfire2/database";

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  settings =[{'ingreso':0,'genero':'Masculino'}];
  nuevoSetting ={'ingreso':0,'genero':'Masculino'};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afd: AngularFireDatabase,
    public toastCtrl: ToastController
  ) {

  }

  ionViewWillLoad() {
    this.getDatafromFirebase();
  }
  presentToast(message) {

    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "top"
    });
    toast.onDidDismiss(() => {
      console.log("Dismissed toast");

    });
    toast.present();
  }
  guardarSettings() {
    this.afd
    .list("/settings/")
    .push(this.nuevoSetting)
    .then(data => {
      console.log('success'+data);
      this.presentToast('datos guardados');
    })
    .catch(error => {
      console.log('error'+error);
    });
  }
  getDatafromFirebase() {
    this.afd
      .list("/settings/", {
        query: {
          'limitToLast': 1
        }
      })
      .subscribe(data => {
        this.settings = data[0];
        this.nuevoSetting = data[0];
        console.log(this.settings);
        this.presentToast('Datos recuperados');
      });
  }
}
