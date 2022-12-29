"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBids = void 0;
const getBids = (req, res, next) => {
    console.log('getBids fired!');
    res.status(201).json({ message: 'Fired function' });
};
exports.getBids = getBids;
