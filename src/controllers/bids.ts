import { RequestHandler } from 'express';
import { HydratedDocument, Types } from 'mongoose';

import { Bid } from '../models/bid';

import { User, IUser } from '../models/user';

import { BidItem } from '../models/bid';

let userId = '63aea559373aac06cd30d624';



export const getBids: RequestHandler = (req, res, next) => {
  Bid.find().populate<{creator: {name: string, _id: string}}>('creator', 'name')
    .exec()
    .then((bids) => {
      res.status(200).json({
        message: 'Fetched bids succesfully',
        bids,
      });
    })
    .catch((err: { statusCode?: number }) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getParticipantIds = () =>
{
	return Bid.find().populate<{creator: {name: string, _id: string}}>('creator', 'name').then(data=> data.map(el=> el.creator._id.toString())).catch(err=> console.log(err))
}

export const createBid: RequestHandler = (req, res, next) => {
  const bidRequest = req.body as Omit<BidItem, 'creator'>;
	console.log(req.body);
  const bid = new Bid({
    addQuality: bidRequest.addQuality,
    manufacturingTime: bidRequest.manufacturingTime,
    warrantyPeriod: bidRequest.warrantyPeriod,
    payTerms: bidRequest.payTerms,
    cost: bidRequest.cost,
    discount: bidRequest.discount,
    creator: userId,
  });
	let creator:HydratedDocument<IUser>;
  bid
    .save()
    .then((result) => {
      return User.findById(userId).exec();
    })
		.then((user) => {
			if (user) {
				creator = user;
				user.bids.push(bid._id);
				return user.save();
			} else {
				const error  = new Error('No user found');
				throw error;
			}
		})
		.then((result) => {
			res.status(201).json({
				message: 'Bid created succesfully',
				bid,
				creator: {
					_id: creator._id,
					name: creator.name
				}
			})
		})
    .catch((err: { statusCode?: number }) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
