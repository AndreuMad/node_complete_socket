const faker = require('faker');
const { expect } = require('chai');

const { isRealString } = require('../utils/validation');

describe('validation', () => {
  describe('isRealString', () => {
    it('rejects non-string values', function it() {
      const numberValue = faker.random.number();

      const numberResult = isRealString(numberValue);
      expect(numberResult).to.be.a.false;
    });

    it('should reject string with only spaces', function it() {
      const string = '   ';
      const result = isRealString(string);

      expect(result).to.be.a.false;
    });

    it('should allow string with non-space characters', function it() {
      const string = faker.lorem.word();
      const result = isRealString(string);

      expect(result).to.be.a.true;
    });
  });
});
