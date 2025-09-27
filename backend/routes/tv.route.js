import express from 'express';
import { getTrendingTv, getTvTrailer, getTvDetails, getTvSimilar, getTvByCategory } from '../controllers/tv.controller.js';
const router = express.Router();

router.get('/trending',getTrendingTv);
router.get('/category/:category',getTvByCategory);
router.get('/:id',getTvDetails);
router.get('/:id/trailers',getTvTrailer);
router.get('/:id/details',getTvDetails);
router.get('/:id/similar',getTvSimilar);

export default router;