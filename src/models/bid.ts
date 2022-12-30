import { Schema, model, Types } from "mongoose"

interface BidItem  {
	name: string,
	addQuality: string,
	manufacturingTime: number,
	warrantyPeriod: number,
	payTerms: number,
	cost: number,
	discount: number,
	creator: Types.ObjectId;
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
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		}

	}
)


export const Bid = model<BidItem>('Bid', BidSchema);

