import { Component, ViewChild } from "@angular/core";
import { NavController } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { isArray } from "ionic-angular/util/util";
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @ViewChild("formNuevo") formNuevo;
  gastoEditable = "";
  viejo: any;
  coinsvisible = false;
  item = false;
  nuevoGasto: any;
  historicogastos: any[];
  categorias: any[];
  categoriasOrdenadas;
  gastos: any[];
  hayGastos = false;
  gastosPorCategoria: any[];
  settingsIngreso;
  settingGastoFijo;
  categoryNames;
  totalesCategoria;
  total = 0;
  categoriaActiva = false;
  nuevo: any = { valor: null, categoria: null, nombre: null };
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public fbd: AngularFireDatabase,
    private toastCtrl: ToastController
  ) {}
  irCategorias() {
    this.navCtrl.push("ListPage");
  }

  getDataFromFirebase() {
    this.fbd.list("/gastos/").subscribe(data => {
      this.gastos = data;
      let organizado = [];
      let gastosFecha = [];
      let totall = 0;
      Object.keys(data).map(function(key) {
        totall += Number(data[key].valor);
        console.log(data);
        let fechaG = data[key].fecha;
let fechas=[];
        let FechaComparar =
          new Date(fechaG).getUTCDate() + "-" + new Date(fechaG).getUTCMonth();

        if (!gastosFecha[fechaG]) {
          gastosFecha[data[key].fecha] = [];
        }

        if (FechaComparar)
         gastosFecha[fechaG].push(data);

        console.log(gastosFecha[fechaG]);
        //  sumamos los gastos por categoria //
        if (organizado[data[key].categoria])
          organizado[data[key].categoria] =
            Number(organizado[data[key].categoria]) + Number(data[key].valor);
        else organizado[data[key].categoria] = Number(data[key].valor);
      });

      this.total = totall;
      this.totalesCategoria = organizado;

      this.gastosPorCategoria = this.agruparPorCategoria(data);
      this.categoryNames = Object.keys(this.gastosPorCategoria);
      this.hayGastos = true;
      console.log(this.gastosPorCategoria);
    });
  }
  getSettingsFromFirebase() {
    this.fbd
      .list("/settings/", {
        query: {
          limitToLast: 1
        }
      })
      .subscribe(data => {
        this.settingsIngreso = Number(data[0].ingreso);
        this.settingGastoFijo = Number(data[0].gastosfijos);
        var result = Object.keys(data).map(function(key) {
          return data[key];
        });

        console.log(result);
      });
  }
  getCategoriasFromFirebase() {
    this.fbd.list("/categorias/").subscribe(data => {
      var result = Object.keys(data).map(function(key) {
        return data[key];
      });
      console.log(result);
      this.categorias = result;
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
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "top"
    });
    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
      this.nuevoGasto = null;
      this.gastoEditable = null;
      this.nuevo = null;
      this.coinsvisible = true;
      this.toggleClass();
    });
    toast.present();
  }
  hideCoins = function() {
    console.log(this.coinsvisible);
    this.coinsvisible = false;
  };
  agregarNuevoGasto = function() {
    let fecha = Date.now();
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
        this.nuevoGasto = null;
        this.gastoEditable = "";
        this.toggleClass();
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

  deleteGasto(gasto) {
    console.log(gasto);
    this.fbd
      .list("/gastos/")
      .remove(gasto.$key)
      .then(data => {
        this.nuevoGasto = null;
        this.gastoEditable = "";
        console.log("dato borrado");
        this.presentToast("Su gasto ha sido guardado");
      })
      .catch(error => {
        console.log("problemas al borrar");
      });
  }
  editGasto(gasto) {
    this.gastoEditable = "edicion";
    this.viejo = gasto;
    console.log(this.viejo);
  }
  crearGasto() {
    this.gastoEditable = "nuevo";
  }
  guardarGasto() {
    this.fbd
      .list("/gastos/")
      .update(this.viejo.$key, this.viejo)
      .then(data => {
        this.gastoEditable = "";
        this.nuevoGasto = null;
        this.nuevo = null;
        this.presentToast("Su gasto ha sido guardado");
        this.toggleClass();
      })
      .catch(error => {
        console.log(error);
      });
    this.presentToast("Su gasto ha sido editado");
  }
  toggleClass() {
    this.item = !this.item;
  }

  ionViewWillLoad() {
    this.getSettingsFromFirebase();
    this.getDataFromFirebase();
    this.getCategoriasFromFirebase();
  }
}
