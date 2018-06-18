const faker = require('faker');
const { expect } = require('chai');

const {
  Users
} = require('../utils/user');

describe.only('user', () => {
  let users;
  const mockedRoom1 = faker.lorem.word();
  const mockedUser1 = {
    id: faker.random.uuid(),
    name: faker.lorem.word(),
    room: mockedRoom1
  };

  const mockedUser2 = {
    id: faker.random.uuid(),
    name: faker.lorem.word(),
    room: mockedRoom1
  };

  const mockedUser3 = {
    id: faker.random.uuid(),
    name: faker.lorem.word(),
    room: faker.lorem.word()
  };

  beforeEach(() => {
    users = new Users();
    users.addUser(mockedUser1.id, mockedUser1.name, mockedUser1.room);
    users.addUser(mockedUser2.id, mockedUser2.name, mockedUser2.room);
    users.addUser(mockedUser3.id, mockedUser3.name, mockedUser3.room);
  });

  it('should add new user', () => {
    const user = {
      id  : faker.random.uuid(),
      name: faker.lorem.word(),
      room: faker.lorem.word()
    };
    const expectedUser = users.addUser(user.id, user.name, user.room);

    expect(users.getAllUsers()).to.deep.equal([mockedUser1, mockedUser2, mockedUser3, expectedUser]);
  });

  it('should remove user', () => {
    expect(users.removeUser(mockedUser3.id)).to.deep.equal([mockedUser3]);
    expect(users.getAllUsers()).to.deep.equal([mockedUser1, mockedUser2]);
  });

  it('should not remove user', () => {
    expect(users.removeUser(`${mockedUser3.id}${faker.lorem.word()}`)).to.be.eql([]);
  });

  it('should find user', () => {
    expect(users.getUser(mockedUser1.id)).to.be.eql(mockedUser1);
  });

  it('should not find user', () => {
    expect(users.getUser(`${mockedUser1.id}${faker.lorem.word()}`)).to.be.eql(undefined);
  });

  it('should return names for particular room', () => {
    expect(users.getUsersList(mockedRoom1)).to.deep.equal([mockedUser1.name, mockedUser2.name]);
  });
});

