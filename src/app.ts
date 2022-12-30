import express, { Request, Response, NextFunction } from 'express';
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



app.use('/bids', bidsRoutes);


app.use('/', authRoutes);


mongoose
  .connect(MONGODB_URI)
  .then((result) => {
		const server = app.listen(8080);
	
  })
	
  .catch((err) => console.log(err));

