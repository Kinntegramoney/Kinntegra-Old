import { IndianCurrencyNumberPipe } from './indian-currency-number.pipe';

describe('IndianCurrencyNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new IndianCurrencyNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
