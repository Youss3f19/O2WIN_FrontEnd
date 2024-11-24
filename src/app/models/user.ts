import { Boxes } from "./boxes";
import { Products } from "./products";


export class User {
    constructor(
      public _id : string,
      public name: string ,
      public lastname: string ,
      public email: string,
      public password: string,
      public role: string = "user" ,
      public solde: number = 0 ,
      public inventory: Products[] = [],
      public boxes: Boxes[] = [],
      public createdAt?: Date,
      public updatedAt?: Date
    ) {}


  }
  