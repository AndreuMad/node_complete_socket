const moment = require('moment');

const generateMessage = (from, text) => ({
  from,
  text,
  createdAt: moment().format('h:mm a')
});

const generateLocationMessage = (from, latitude, longitude) => ({
  from,
  url      : `https://google.com/maps?q=${latitude},${longitude}`,
  createdAt: moment().format('h:mm a')
});

module.exports = {
  generateMessage,
  generateLocationMessage
};
