import express from "express";
import { getTrendingMovie, getMovieTrailer, getMovieDetails, getMovieSimilar, getMovieByCategory } from "../controllers/movie.controller.js";

const router = express.Router();

router.get('/trending',getTrendingMovie);
router.get('/category/:category',getMovieByCategory);
router.get('/:id',getMovieDetails);
router.get('/:id/trailers',getMovieTrailer);
router.get('/:id/details',getMovieDetails);
router.get('/:id/similar',getMovieSimilar);

export default router;