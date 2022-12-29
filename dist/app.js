"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// TODO: Use typecasting to type body in bodyparser
const bids_1 = __importDefault(require("./routes/bids"));
const app = (0, express_1.default)();
app.use('/bids', bids_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.listen(3000);
