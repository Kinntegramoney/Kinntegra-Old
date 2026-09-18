import { ShortCurrencyNumberPipe } from './short-currency-number.pipe';

describe('ShortCurrencyNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortCurrencyNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
