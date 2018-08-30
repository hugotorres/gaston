import { Injectable } from "@angular/core";
import { Gasto } from "../models/gasto";
import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class Settings {
  settings: any;
  gastos: Gasto[] = [];

  constructor(public afd: AngularFireDatabase) {}

  getDatafromFirebase() {
    this.afd
      .list("/settings/", {
        query: {
          limitToLast: 1
        }
      })
      .subscribe(data => {
        for (let gasto of data) {
          this.gastos.push(new Gasto(gasto));
        }
        console.log(this.settings);
        return (this.settings = data);

        //this.nuevoSetting = data[0];
        //console.log(this.settings);
        //this.presentToast("Datos recuperados");
      });
  }
  guardarSettings(settings) {
    this.afd
      .list("/settings/")
      .push(settings)
      .then(data => {
        console.log("success" + data);
        // this.presentToast("datos guardados");
      })
      .catch(error => {
        console.log("error" + error);
      });
  }

  query(params?: any) {
    if (!params) {
      return this.gastos;
    }

    return this.gastos.filter(gasto => {
      for (let key in params) {
        let field = gasto[key];
        if (
          typeof field == "string" &&
          field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0
        ) {
          return gasto;
        } else if (field == params[key]) {
          return gasto;
        }
      }
      return null;
    });
  }

  add(gasto: Gasto) {
    this.gastos.push(gasto);
  }

  delete(gasto: Gasto) {
    this.gastos.splice(this.gastos.indexOf(gasto), 1);
  }
}
