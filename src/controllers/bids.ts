import { RequestHandler } from "express"

export const getBids: RequestHandler = (req, res, next) => {
	console.log('getBids fired!')
	res.status(201).json({message: 'Fired function'})
}