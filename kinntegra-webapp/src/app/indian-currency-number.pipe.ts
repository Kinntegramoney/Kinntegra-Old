import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrencyNumber',
  standalone: true
})
export class IndianCurrencyNumberPipe implements PipeTransform {

  transform(value: number): string {
    let decimal = (value - Math.floor(value)).toString();
    let money = Math.floor(value).toString();
    let length = money.length;
    let delimiter = '';
    let reversedMoney = money.split('').reverse().join('');

    for (let i = 0; i < length; i++) {
      if ((i == 3 || (i > 3 && (i - 1) % 2 == 0)) && i != length) {
        delimiter += ',';
      }
      delimiter += reversedMoney[i];
    }

    let result = delimiter.split('').reverse().join('');
    decimal = decimal.replace(/0\./, '.').substring(0, 3);

    if (decimal !== '0') {
      result += decimal;
    }
    else{
      result += '.00';
    }

    return result;
  }

}
