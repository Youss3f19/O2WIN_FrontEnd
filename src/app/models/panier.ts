import { Box } from "./box";

export class Panier {
    constructor(
        public box: Box,
        public quantity: number = 1,
    ){}
}
