import express from "express";
import reader from "./reader";
import book from "./book";
import author from "./author";
import bookPrint from "./bookPrint";
import bookBorrow from "./bookBorrow";

const router = express.Router();

router.use('/reader', reader);
router.use('/author', author);
router.use('/book', book);
router.use('/bookPrint', bookPrint);
router.use('/bookBorrow', bookBorrow);


export default router;