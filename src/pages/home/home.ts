import { Component, ViewChild } from "@angular/core";
import { NavController } from "ionic-angular";
import { Http } from "@angular/http";
import { Chart } from "chart.js";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @ViewChild("barCanvas") barCanvas;
  nuevoGasto: any;

  historicogastos: any[];
  gastos: any;
  barChart: any;
  nuevo: any = { valor: null, categoria: null, nombre: null };
  constructor(
    public navCtrl: NavController,
    private http: Http,
    public storage: Storage
  ) {
    this.gastos = {};
    this.gastos.items = [];
    this.storage
      .get("historico")
      .then(value => {
      //  value ? (this.localData = value) : (this.localData = null);
       // let information = this.localData;
       // this.information = information;
        this.historicogastos = value;
      })
      .catch(function(error) {
        console.log(error);
      });
    /*  let localData = http
      .get("assets/information.json")
      .map(res => res.json().items);
    localData.subscribe(data => {
      this.information = data;
    });
    */

  }
  agregarNuevoGasto = function() {
    this.nuevo.fecha = new Date();
    this.nuevoGasto = {
      valor: this.nuevo.valor,
      nombre: this.nuevo.nombre,
      categoria: this.nuevo.categoria,
      fecha: this.nuevo.fecha
    };
    if(this.gastos.items[this.nuevo.categoria]){
      this.gastos.items[this.nuevo.categoria].push(this.nuevoGasto);
    }else{
      this.gastos.items[this.nuevo.categoria]=[];
      this.gastos.items[this.nuevo.categoria].push(this.nuevoGasto);
    }
    this.historicogastos = this.gastos.items;
    this.storage.set("historico", this.historicogastos);
    alert('item saved !')
  };



  ionViewDidLoad() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}
