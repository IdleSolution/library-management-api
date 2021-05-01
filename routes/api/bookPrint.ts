import express from "express";
import { body, validationResult } from "express-validator";
import { BookPrintModel as BookPrint } from "./../../models/BookPrint";
import { BookModel as Book } from "./../../models/Book";
import { BookBorrowedModel as BookBorrowed } from "./../../models/BookBorrowed";
import mongoose from "mongoose";


const router = express();

// @route   POST api/bookPrint/new
// @desc    Adds a new book print
// @body    bookId, quality, language
router.post(
    "/new",
    body("bookId").exists(),
    body("language").exists(),
    async (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let { bookId, quality, language } = req.body;
        bookId = new mongoose.Types.ObjectId(bookId);
        const count = await Book.count({"_id": bookId});
        if(count !== 1) {
            return res.status(400).json({ errors: [{author: "Could not find given book in the database."}], message: "Something went wrong."});
        }

        const bookPrint = new BookPrint();

        bookPrint.bookId = bookId;
        bookPrint.language = language;
        bookPrint.quality = quality;

        bookPrint.save().then(() => {
            return res.status(200).json({message: "Succesfully added a book print to the database."});
        }).catch(e => {
            return res.status(500).json({message: "Something went wrong.", error: e})
        })

})


// @route   GET api/bookPrint/available
// @desc    Returns a list of all available prints of a single book
// @body    bookId
router.get(
    "/available",
    body("bookId").exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookId } = req.body;

        const count = await Book.count({"_id": bookId});
        if(count !== 1) {
            return res.status(400).json({ errors: [{author: "Could not find given book in the database."}], message: "Something went wrong."});
        }

        const books = await BookPrint.find({"bookId": bookId, "borrowed": false});

        return res.status(200).json(books);
    }
)

export default router;