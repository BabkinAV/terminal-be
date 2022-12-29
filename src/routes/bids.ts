import { Router } from "express";
import { getBids } from "../controllers/bids";

const router = Router();


router.get('/', getBids);




export default router;