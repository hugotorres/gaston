import { Component } from "@angular/core";
import { IonicPage, NavController} from "ionic-angular";

import { AngularFireDatabase } from "angularfire2/database";
import { ToastController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  settingEdit = false;
  camposRecurrentes = [];
  //settings: FirebaseListObservable;
  settings: any[];
  nuevoSetting: any = { 'genero': "", 'ingreso': 0, 'gastosfijos': 0,'fechaingresos':null };
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public fbd: AngularFireDatabase
  ) {
    this.getSettingsFromFirebase();
  }
  getSettingsFromFirebase() {
    this.fbd
      .list("/settings/", {
        query: {
          limitToLast: 1
        }
      })
      .subscribe(data => {
        var result = Object.keys(data).map(function(key) {
          return data[key];
        });
        this.settings = result;
        this.nuevoSetting = result[0];
      });
  }
  agregarCampo() {
    this.camposRecurrentes.push({ 'valorAdicional': null, 'nombre': null });
  };
  sumarGastos=function() {
    let suma = 0;
    for (let gasto of this.camposRecurrentes) {
      console.log(gasto);
      suma = suma + Number(gasto.valorAdicional);
    }
    this.nuevoSetting.gastosfijos =  suma;
    this.camposRecurrentes=[];
  }

  ionViewWillLoad() {
    this.getSettingsFromFirebase();
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: "top"
    });
    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });
    toast.present();
  }
  guardarSettings() {
    this.fbd.list("/settings").push(this.nuevoSetting);
    this.getSettingsFromFirebase();
    this.presentToast("sus datos se han guardado");
  }
}
