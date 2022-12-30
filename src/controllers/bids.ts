import { RequestHandler } from 'express';

import { Bid } from '../models/bid';

export const getBids: RequestHandler = (req, res, next) => {
  Bid.find().exec().then((bids) => {
    res.status(200).json({
      message: 'Fetched bids succesfully',
      bids,
    });
  }).catch((err) => {
		if (!err.statusCode) {
			err.statusCode = 500
		}
		next(err);
	})
};

