"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bids_1 = require("../controllers/bids");
const router = (0, express_1.Router)();
router.get('/', bids_1.getBids);
exports.default = router;
