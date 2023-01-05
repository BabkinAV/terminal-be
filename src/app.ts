import express, { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { createServer } from 'http';
import {json} from 'body-parser';
import mongoose from 'mongoose';


import bidsRoutes from './routes/bids';
import authRoutes from './routes/auth';
import {init, getIO} from './socket/socket'
import { timerUpdate } from './socket/timerHandler';

const MONGODB_URI =
  'mongodb+srv://raybeck:RfG8yjk8zNNCyW3k@cluster0.jevkr.mongodb.net/terminal?retryWrites=true&w=majority';




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

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	console.log(error);
  const status = error.statusCode;
  const message = error.message;
	const data = error.data;
  res.status(status).json({ message, data });
}

app.use(errorHandler);


mongoose
  .connect(MONGODB_URI)
  .then((result) => {
		const httpServer = createServer(app);
		const io = init(httpServer);
		

		io.on("connection", (socket) => {
			console.log('client connected!');
			socket.emit('currentTimer', counter, currentUser);
			socket.on('timerSkip', () => {
				clearInterval(intervalId);
				counter = 30;
				currentUser = (currentUser === 3) ? 0 : ++currentUser;
				console.log('Manual timer reset! Current timer: ', counter, 'Current user: ', currentUser);
				io.emit('timerReset', counter, currentUser);
				intervalId = setInterval(() => {

					[counter, currentUser] = timerUpdate(counter, currentUser, io)
				
				}, 1000);
				
			})
		});

		let intervalId = setInterval(() => {

			[counter, currentUser] = timerUpdate(counter, currentUser, io)

			
		
		}, 1000);


		
		
		httpServer.listen(8080);
	
  })
	
  .catch((err) => console.log(err));

