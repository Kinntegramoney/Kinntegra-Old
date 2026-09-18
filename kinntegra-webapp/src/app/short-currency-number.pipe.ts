import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortCurrencyNumber',
  standalone: true
})
export class ShortCurrencyNumberPipe implements PipeTransform {

  transform(value: number): string {
    var sign = (value.toString().charAt(0) == '-') ? '-' : '';
    var num = Number(value.toString().replace('-', ''));

    if (num >= 0 && num < 100) {
      return sign + num.toFixed(0);
    } else if (num >= 100 && num < 100000) {
      num = num / 1000;
      return sign + num.toFixed(2) + "K";
    } else if (num >= 100000 && num < 10000000) {
      num = num / 100000;
      return sign + num.toFixed(2) + "L";
    } else if (num >= 10000000) {
      num = num / 10000000;
      return sign + num.toFixed(2) + "C";
    } else {
      return sign + num.toString();
    }
  }

}
