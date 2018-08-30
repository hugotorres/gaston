import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from "@angular/core";

@Injectable()
export class Databaseservice {
  constructor(private _af: AngularFireDatabase) {}

  publicListSettings() {
    return this._af.list("/settings");
  }
}
