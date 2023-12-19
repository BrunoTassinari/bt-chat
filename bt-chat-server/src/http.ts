import { usersRoutes } from 'User/UserRoutes';
import express from 'express';
import http from 'http';
import { errorMiddleware } from 'middlewares/errorMiddleware';
import { notFoundMiddleware } from 'middlewares/notFoundMiddleware';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

app.use(usersRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const serverHttp = http.createServer(app);

const io = new Server(serverHttp);

export { serverHttp, io };
