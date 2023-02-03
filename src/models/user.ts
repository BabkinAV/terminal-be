import { Schema, model, Types } from 'mongoose';

export interface IUser {
  name: string;
  password: string;
  bids: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  password: { type: String, required: true },
  bids: [{ type: Schema.Types.ObjectId, ref: 'Bid' }],
});

export const User = model<IUser>('User', userSchema);
