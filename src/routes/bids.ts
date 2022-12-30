import { Router } from "express";
import { getBids, createBid } from "../controllers/bids";

const router = Router();


router.get('/', getBids);

// POST /bids/createbid
router.post('/createbid', createBid);

// TODO:use generics to type dynamic parame



export default router;