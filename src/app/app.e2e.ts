import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have header', (done) => {
    element(by.css('h1')).isPresent().then((present) => {
      let result = true;
      expect(present).toEqual(result);
      done();
    });
  });

  it('should have <home>', (done) => {
    element(by.css('app home')).isPresent().then((present) => {
      let result = true;
      expect(present).toEqual(result);
      done();
    });
  });

});
