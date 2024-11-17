import { Box } from "./box";
import { Products } from "./products";

export class Boxes {
    constructor(
        public box: Box,
        public opened: Boolean = false,
        public products : Products[],
    ){}
}
