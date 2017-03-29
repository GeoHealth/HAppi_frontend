import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', (done) => {
    browser.getTitle().then((title) => {
      let result = 'Angular2 Webpack Starter by @gdi2290 from @AngularClass';
      expect(title).toEqual(result);
      done();
    });
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

  it('should have buttons', (done) => {
    element(by.css('button')).getText().then((text) => {
      let result = 'Submit Value';
      expect(text).toEqual(result);
      done();
    });
  });

});
