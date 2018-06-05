const faker = require('faker');
const { expect } = require('chai');

const {
  generateMessage,
  generateLocationMessage
} = require('../utils/message');

describe('message', () => {
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

  it('function generateLocationMessage generates proper message object', function it() {
    const from = faker.lorem.word();
    const latitude = faker.random.number();
    const longitude = faker.random.number();

    const result = generateLocationMessage(from, latitude, longitude);
    expect(result).to.include({
      from,
      url: `https://google.com/maps?q=${latitude},${longitude}`
    });
    expect(result.createdAt).to.be.a('number');
  })
});
