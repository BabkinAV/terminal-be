import * as dotenv from 'dotenv';
import express, { ErrorRequestHandler } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import bidsRoutes from './routes/bids';
import authRoutes from './routes/auth';
import jwt from 'jsonwebtoken';

import { timerUpdate, registerTimerSkip } from './socket/timerHandler';
import { getParticipantIds } from './controllers/bids';

dotenv.config();

const maxCounter = 120;
let counter = maxCounter;
let currentUser = 0;

mongoose.set('strictQuery', false);

const app = express();

app.use(json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/bids', bidsRoutes);

app.use('/', authRoutes);

export class StatusError extends Error {
  statusCode?: number;
  data?: string;
}





const errorHandler: ErrorRequestHandler = (
  error: StatusError,
  req,
  res,
  next
) => {
  // console.log(error);
  const status = error.statusCode ?? 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
};

app.use(errorHandler);


mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log('MongoDB connected!')
    return getParticipantIds()})
  .then((participantIdArray) => {
    if (participantIdArray) {
      const httpServer = createServer(app);
      const io = new Server(httpServer, {
        cors: {
          origin: [
            'https://classy-zuccutto.netlify.app',
            'http://localhost:3000',
          ],
        },
      });

      io.on('connection', (socket) => {
        // console.log(`client ${socket.id} connected!`);
        socket.emit('currentTimer', counter, participantIdArray[currentUser]);

        socket.on('timerSkip', () => {
          let userId: string;
          let decodedToken;
          try {
            decodedToken = jwt.verify(
              socket.handshake.auth.token,
              process.env.JWT_SECRET
            ) as { userId: string };
            userId = decodedToken.userId;

            if (
              decodedToken &&
              participantIdArray[currentUser] === decodedToken.userId
            ) {
              [counter, currentUser] = registerTimerSkip(
                io,
                socket,
                intervalId,
                counter,
								maxCounter,
                currentUser,
                participantIdArray!
              );
              intervalId = setInterval(() => {
                [counter, currentUser] = timerUpdate(
                  counter,
									maxCounter,
                  currentUser,
                  io,
                  participantIdArray
                );
              }, 1000);
            } else {
              throw Error('Not authorized');
            }
          } catch (error) {
            // console.log('Not authorized');
            socket.emit('authError', 'Not authorized');
          }
        });

        // socket.on('disconnect', () => {
        //   console.log(`Socket ${socket.id} has been disconnected`);
        // });
      });

      let intervalId = setInterval(() => {
        [counter, currentUser] = timerUpdate(
          counter,
					maxCounter,
          currentUser,
          io,
          participantIdArray
        );
      }, 1000);
      httpServer.listen(8080);
    } else {
      throw new Error('No participant list found');
    }
  })

  .catch((err) => console.log(err));
