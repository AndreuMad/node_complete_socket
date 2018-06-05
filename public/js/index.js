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
    createdAt,
    text
  } = message;
  const $template = jQuery('#message-template').html();
  const $html = Mustache.render($template, {
    from,
    createdAt,
    text
  });

  $messageList.append($html);
});

socket.on('newLocationMessage', (message) => {
  const {
    from,
    createdAt,
    url
  } = message;
  const $template = jQuery('#location-message-template').html();
  const $html = Mustache.render($template, {
    from,
    createdAt,
    url
  });
  $messageList.append($html);
});

jQuery('#message-form')
  .on('submit', (event) => {
    event.preventDefault();
    const $messageInput = jQuery(event.currentTarget).find('[name=message]');

    socket.emit('createMessage', {
      from: 'Jquery',
      text: $messageInput.val()
    }, () => {
      $messageInput.val('');
    });
  });

const $sendLocationButton = jQuery('#send-location');
$sendLocationButton.on('click', () => {
  $sendLocationButton
    .attr('disabled', true)
    .text('Sending location...');
  const position = navigator.geolocation.getCurrentPosition(
    (data) => {
      const {
        latitude,
        longitude
      } = data.coords;
      $sendLocationButton
        .attr('disabled', false)
        .text('Send location');

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
