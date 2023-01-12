import * as dotenv from 'dotenv' 
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';
import { createServer } from 'http';
import {Server} from "socket.io"
import { json } from 'body-parser';
import mongoose from 'mongoose';

import bidsRoutes from './routes/bids';
import authRoutes from './routes/auth';
import jwt from 'jsonwebtoken';

import { init, getIO } from './socket/socket';
import { timerUpdate } from './socket/timerHandler';
import { registerTimerSkip } from './socket/timerUpdateHandler';
import { getParticipantIds } from './controllers/bids';

dotenv.config();

let counter = 30;
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
  console.log(error);
  const status = error.statusCode ?? 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
};

app.use(errorHandler);


mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => getParticipantIds())
  .then((participantIdArray) => {
    console.log(participantIdArray);
    if (participantIdArray) {
      const httpServer = createServer(app);
      const io = new Server (httpServer,  { cors: { origin: ['http://localhost:3000', 'https://classy-zuccutto-32be7d.netlify.app'] } });

      io.on('connection', (socket) => {
        // console.log(`client ${socket.id} connected!`);
        socket.emit('currentTimer', counter, participantIdArray[currentUser]);

        socket.on('timerSkip', () => {
					let userId: string;
					let decodedToken;
					try {
						decodedToken = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET) as {userId: string};
						 userId = decodedToken.userId;

						 if (decodedToken && participantIdArray[currentUser] === decodedToken.userId) {

							[counter, currentUser] = registerTimerSkip(
								io,
								socket,
								intervalId,
								counter,
								currentUser,
								participantIdArray!
							);
							intervalId = setInterval(() => {
								[counter, currentUser] = timerUpdate(
									counter,
									currentUser,
									io,
									participantIdArray
								);
							}, 1000);
						} else {
							throw Error('Not authorized');
						}
						
					} catch (error) {
						
						console.log('Not authorized');
						socket.emit('authError', 'Not authorized');
					}
					
          
        });

				// socket.on('disconnect', () => {
				// 	console.log(`Socket ${socket.id} has been disconnected`)
				// })

      });


      let intervalId = setInterval(() => {
        [counter, currentUser] = timerUpdate(
          counter,
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
