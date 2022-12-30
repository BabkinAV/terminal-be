import express, { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import {json} from 'body-parser';
import mongoose from 'mongoose';
import { Bid } from './models/bid';

import bidsRoutes from './routes/bids';
import authRoutes from './routes/auth';

const MONGODB_URI =
  'mongodb+srv://raybeck:RfG8yjk8zNNCyW3k@cluster0.jevkr.mongodb.net/terminal?retryWrites=true&w=majority';



// const intervalId = setTimeout(()=> {
// 	console.log('Interval pinged!')
// }, 1000);

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
		const server = app.listen(8080);
	
  })
	
  .catch((err) => console.log(err));

