import { Inventory } from "./inventory";
import { User } from "./user";

export class Commande {
    constructor(
        public _id : string,
        public user: User,
        public products: Inventory[],
        public status : string
    ){}
}
