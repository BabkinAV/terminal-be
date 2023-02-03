import { RequestHandler } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { StatusError } from "../app";
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

export const loginController: RequestHandler = (req, res, next) => {
	const name = req.body.name;
	User.findOne({name}).then((user) =>{
		if (!user) {
			const error = new StatusError('Specified user could not be found');
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign({name: user.name, userId: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '1d'})
		res.status(200).json({userId: user._id.toString(), token})
	})
	.catch((err: StatusError) => {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err)
	})

}


