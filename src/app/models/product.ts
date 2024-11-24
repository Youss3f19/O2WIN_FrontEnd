    import { Category } from "./category";
    import { Rarity } from "./rarity";

    export class Product {

        constructor(
            public _id: string,
            public name: string,
            public description: string,
            public price: number,
            public stock : number,
            public categories: Category[],
            public rarity: Rarity,
            public productImage?: string,


        ){}
    }
