const faker = require('faker');
const { expect } = require('chai');

const { generateMessage } = require('../utils/message');

describe('generateMessage', () => {
  it('function generateMessage generates proper message object', function it() {
    const from = faker.lorem.word();
    const text = faker.lorem.word();

    const result = generateMessage(from, text);

    expect(result).to.include({
      from,
      text
    });
    expect(result.createdAt).to.be.a('number');
  });
});
