import { RequestHandler } from "express";
import bcrypt from 'bcrypt';

import { User } from "../models/user";

export const signupController:RequestHandler = (req, res, next) => {
	const user = req.body as {name: string, password: string};

	const name = user.name.toLowerCase();
	const password = user.password;
	bcrypt.hash(password, 12).then((hashedPassword)=>{
		const user = new User({
			name,
			password: hashedPassword
		});
		return user.save()
	})
	.then((result) => {
		res.status(201).json({message: 'User created!', userId: result._id})
	})
	.catch((err) => {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err);
	})
	
	
}
