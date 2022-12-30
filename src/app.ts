import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Bid } from './models/bid';

// TODO: Use typecasting to type body in bodyparser

import bidsRoutes from './routes/bids';

const MONGODB_URI =
  'mongodb+srv://raybeck:RfG8yjk8zNNCyW3k@cluster0.jevkr.mongodb.net/terminal?retryWrites=true&w=majority';



// const intervalId = setTimeout(()=> {
// 	console.log('Interval pinged!')
// }, 1000);

mongoose.set('strictQuery', false);

const app = express();

app.use('/bids', bidsRoutes);



mongoose
  .connect(MONGODB_URI)
  .then((result) => {
		const server = app.listen(8080);
	
  })
	
  .catch((err) => console.log(err));

