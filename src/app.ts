import express, { Request, Response, NextFunction } from 'express';

// TODO: Use typecasting to type body in bodyparser

import bidsRoutes from './routes/bids';



const intervalId = setInterval(()=> {
	console.log('Interval pinged!')
}, 1000);

const app = express();

app.use('/bids', bidsRoutes);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	res.status(500).json({message: err.message})
});

app.listen(3000);

