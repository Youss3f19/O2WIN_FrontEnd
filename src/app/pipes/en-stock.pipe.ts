import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enStock',
  standalone: true
})
export class EnStockPipe implements PipeTransform {

  transform(quantity: number): string {
    return quantity>0? 'En stock' : 'Rupture de stock';
  }

}
