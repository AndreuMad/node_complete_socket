const socket = io();

socket.on('connect', () => {
  console.log('Successfully connected to server');

  socket.emit('createMessage', {
    from: 'Frontend',
    text: 'Frontend Message'
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (data) => {
  console.log('New Email', data);
});
