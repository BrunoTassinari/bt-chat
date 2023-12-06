import { usersRoutes } from 'User/UserRoutes';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

app.use(usersRoutes);

const serverHttp = http.createServer(app);

const io = new Server(serverHttp);

export { serverHttp, io };
