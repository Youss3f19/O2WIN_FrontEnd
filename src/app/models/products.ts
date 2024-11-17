import { Product } from "./product";

export class Products {
    constructor(
        public product: Product,
        public quantity : number = 1
    ){}
}
