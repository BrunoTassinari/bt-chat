import { io } from './http';

io.on('connection', socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);

  socket.on('join_room', params => {
    console.log(params);
  });
});
