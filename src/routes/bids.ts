import { Router } from "express";
import { getBids } from "../controllers/bids";

const router = Router();


router.get('/', getBids);

// TODO:use generics to type dynamic parame



export default router;