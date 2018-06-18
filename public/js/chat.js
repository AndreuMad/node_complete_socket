const socket = io();

const $messageList = jQuery('#message-list');
const $usersList = jQuery('#users');

const scrollToBottom = function() {
  const $newMessage = $messageList.children('li:last-child');
  const clientHeight = $messageList.prop('clientHeight');
  const scrollTop = $messageList.prop('scrollTop');
  const scrollHeight = $messageList.prop('scrollHeight');
  const newMessageHeight = $newMessage.innerHeight();
  const lastMessageHeight = $newMessage.prev().innerHeight();

  if (scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
    $messageList.scrollTop(scrollHeight);
  }
};

socket.on('connect', () => {
  const params = jQuery.deparam(window.location.search.replace('?', ''));
  socket.emit('join', params, (error) => {
    if (error) {
      alert(error);
      window.location = '/';
    } else {
      console.log('No error!');
    }
  });
});

socket.on('UPDATE_USERS_LIST', (users) => {
  const $usersListInner = jQuery('<ol></ol>');

  users.forEach(user => $usersListInner.append(jQuery('<li></li>').text(user)));
  $usersList.html($usersListInner);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('NEW_MESSAGE', (message) => {
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
  scrollToBottom();
});

socket.on('NEW_LOCATION_MESSAGE', (message) => {
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
  scrollToBottom();
});

jQuery('#message-form')
  .on('submit', (event) => {
    event.preventDefault();
    const $messageInput = jQuery(event.currentTarget).find('[name=message]');

    socket.emit('CREATE_MESSAGE', {
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

      socket.emit('CREATE_LOCATION_MESSAGE', {
        latitude,
        longitude
      });
    },
    () => {
      console.log('Enable to get geolocation');
    }
  );
});
