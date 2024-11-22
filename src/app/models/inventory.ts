import { Product } from "./product";

export class Inventory {
    constructor(
        public product : Product,
        public quantity : number
    ){}
}
