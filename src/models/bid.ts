import { Schema, model } from "mongoose"

interface BidItem  {
	name: string,
	addQuality: string,
	manufacturingTime: number,
	warrantyPeriod: number,
	payTerms: number,
	cost: number,
	discount: number
}

const BidSchema = new Schema<BidItem>(
	{
		name: {type: String, required: true},
		addQuality: {type: String, required: false},
		manufacturingTime: {type: Number, required: true},
		warrantyPeriod: {type: Number, required: true},
		payTerms: {type: Number, required: true},
		cost: {type: Number, required: true},
		discount: {type: Number, required: true},

	}
)


export const Bid = model<BidItem>('Bid', BidSchema);

