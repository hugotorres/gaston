import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Http } from "@angular/http";
import { ToastController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { AlertController } from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { isArray } from "ionic-angular/util/util";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  nuevoGasto: any;
  historicogastos: any[];
  categorias: string[];
  gastos: any[];
  gastosPorCategoria: any[];

  nuevo: any = { valor: null, categoria: null, nombre: null };
  constructor(
    public navCtrl: NavController,
    private http: Http,
    public storage: Storage,
    private alertCtrl: AlertController,
    public fbd: AngularFireDatabase,
    private toastCtrl: ToastController
  ) {}
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });
    toast.present();
  }
  getDatafromFirebase() {
    this.fbd.list("/gastos/").subscribe(data => {
      this.gastos = data;
      this.gastosPorCategoria = this.agruparPorCategoria(data);
    });
  }
  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ["Ok"]
    });
    alert.present();
  }

  agregarNuevoGasto = function() {
    let fecha =
      new Date().getFullYear() +
      " - " +
      new Date().getMonth() +
      " - " +
      new Date().getDate();
    this.nuevoGasto = {
      valor: this.nuevo.valor,
      nombre: this.nuevo.nombre,
      categoria: this.nuevo.categoria,
      fecha: fecha
    };
    this.fbd
      .list("/gastos/")
      .push(this.nuevoGasto)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
    this.presentToast("Su gasto ha sido guardado");
  };

  agruparPorCategoria(desordenado) {
    let ordenado = [];
    for (let obj in desordenado) {
      let item = desordenado[obj];
      if (!isArray(ordenado[item.categoria])) {
        ordenado[item.categoria] = [];
      }
      ordenado[item.categoria].push(item);
    }
    return ordenado;
  }

  ionViewDidLoad() {
    this.getDatafromFirebase();
  }
}
