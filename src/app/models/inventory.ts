import { Product } from "./product";

export class Inventory {
    constructor(
        public products : Product[],
        public quantity : number
    ){}
}
