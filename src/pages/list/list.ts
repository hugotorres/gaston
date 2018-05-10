import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { isArray } from "ionic-angular/util/util";
@Component({
  selector: "page-list",
  templateUrl: "list.html"
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items = ["item1", "item2"];
  data: any;
  gastos;
  categorias =[];
  arregloObjetos: any[];
  nuevaCategoria;
  //items: Array<{title: string, note: string, icon: string}>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afd: AngularFireDatabase
  ) {

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get("item");
    this.getDatafromFirebase();
  }

  getDatafromFirebase() {
    this.afd.object("/categorias/").subscribe(data => {
      var result = Object.keys(data).map(function(key) {
        return  data[key];
      });
      this.categorias =result;
      console.log(this.categorias);
    });

  }

  key(object) {
    return Object.keys(object);
  }
  agregarCategoria=function(){
    this.afd
    .list("/categorias/")
    .push(this.nuevaCategoria)
    .then(data => {
      console.log('success'+data);
      this.nuevaCategoria = null;
    })
    .catch(error => {
      console.log('error'+error);
    });
  }

  agruparPorCategoria(desordenado) {
    var ordenado =[];
    for (let obj in desordenado) {
      let item = desordenado[obj];
      if (!isArray(ordenado[item.categoria])) {
        ordenado[item.categoria] = [];
      }
      ordenado[item.categoria].push(item);
    }
    console.log(ordenado);
    return ordenado;
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
  ionViewDidLoad() {

  }
}
