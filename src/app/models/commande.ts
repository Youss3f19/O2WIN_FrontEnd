import { Inventory } from "./inventory";
import { User } from "./user";

export class Commande {
    constructor(
        public user: User,
        public products: Inventory[],
        public status : string[]
    ){}
}
