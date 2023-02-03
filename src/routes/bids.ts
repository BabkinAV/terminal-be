import { Router } from "express";
import { getBids } from "../controllers/bids";

const router = Router();


router.get('/', getBids);

// POST /bids/createbid
// router.post('/createbid', createBid);




export default router;