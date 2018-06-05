const socket = io();

const $messageList = jQuery('#message-list');

socket.on('connect', () => {
  console.log('Successfully connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
  const {
    from,
    text
  } = message;
  const $message = jQuery('<li></li>');

  $message.text(`${from}: ${text}`);
  $messageList.append($message);
});

socket.on('newLocationMessage', (message) => {
  const $message = jQuery('<li></li>');
  const $messageLink = jQuery('<a target="_blank">My current location</a>')

  $message.text(`${message.from}: `);
  $messageLink.attr('href', message.url);
  $message.append($messageLink);
  $messageList.append($message);
});

jQuery('#message-form')
  .on('submit', (event) => {
    event.preventDefault();
    const $messageInput = jQuery(event.currentTarget).find('[name=message]');

    socket.emit('createMessage', {
      from: 'Jquery',
      text: $messageInput.val()
    }, () => {
      $messageInput.val('')
    });
  });

const $sendLocationButton = jQuery('#send-location');
$sendLocationButton.on('click', () => {
  const position = navigator.geolocation.getCurrentPosition(
    (data) => {
      const {
        latitude,
        longitude
      } = data.coords;

      socket.emit('createLocationMessage', {
        latitude,
        longitude
      });
    },
    () => {
      console.log('Enable to get geolocation');
    }
  );
});
