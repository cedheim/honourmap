'use strict';

describe('Coordinates E2E Tests:', function () {
  describe('Test Coordinates page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/coordinates');
      expect(element.all(by.repeater('coordinate in coordinates')).count()).toEqual(0);
    });
  });
});
