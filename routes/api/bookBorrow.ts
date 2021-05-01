import express from "express";
import { body, validationResult } from "express-validator";
import { BookPrintModel as BookPrint } from "./../../models/BookPrint";
import { ReaderModel as Reader } from "./../../models/Reader";
import { BookBorrowedModel as BookBorrowed } from "./../../models/BookBorrowed";
import mongoose from "mongoose"

const router = express();

// @route   POST api/bookBorrow
// @desc    Adds a new borrowed book (borrows book to a reader)
// @body    bookPrintId, borrowerId, dueDate (date in YYYY-DD-MM format)
router.post(
    "", 
    body("bookPrintId").exists(),
    body("borrowerId").exists(),
    async (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let { bookPrintId, borrowerId, dueDate } = req.body;
        bookPrintId = new mongoose.Types.ObjectId(bookPrintId);
        borrowerId = new mongoose.Types.ObjectId(borrowerId);

        let bookPrint = await BookPrint.findOne({"_id": bookPrintId});
        let countBorrower = await Reader.count({"_id": borrowerId});
        let countBorrowed = await BookBorrowed.count({"bookPrintId": bookPrintId});

        if(!bookPrint) {
            return res.status(400).json({ errors: [{bookPrint: "Could not find given book print in the database."}], message: "Something went wrong."});
        }

        if(countBorrowed === 1) {
            return res.status(400).json({ errors: [{bookPrint: "Given print is already borrowed."}], message: "Something went wrong."});
        }

        if(countBorrower !== 1) {
            return res.status(400).json({ errors: [{reader: "Could not find given reader in the database."}], message: "Something went wrong."});
        }

        // if no due date is specified, set the default
        if(dueDate === undefined) {
            const today = new Date();
            const priorDate = new Date().setDate(today.getDate() + 30);
            dueDate = new Date(priorDate)
        }

        const bookBorrowed = new BookBorrowed();
        bookBorrowed.bookPrintId = bookPrintId;
        bookBorrowed.borrowerId = borrowerId;
        bookBorrowed.borrowedDate = new Date();
        bookBorrowed.dueDate = dueDate;


        bookBorrowed.save().then(() => {
            bookPrint!.borrowed = true;
            bookPrint!.save().then(() => {
                return res.status(200).json({message: "Succesfully added a new borrow to the database."});
            })
        }).catch(e => {
            return res.status(500).json({message: "Something went wrong.", error: e})
        })
})


// @route   DELETE api/bookBorrow
// @desc    Removes borrowed book (returns book to library)
router.delete(
    "",
    body("readerId").exists(),
    body("bookPrintId").exists(),
    async (req, res) => {
        let { readerId, bookPrintId } = req.body;
        readerId = new mongoose.Types.ObjectId(readerId);
        bookPrintId = new mongoose.Types.ObjectId(bookPrintId);

        let count = await Reader.count({"_id": readerId});
        if(count !== 1) {
            return res.status(400).json({ errors: [{author: "Could not find the reader in the database."}], message: "Something went wrong."});
        }
        let bookBorrowed = await BookBorrowed.findOne({"bookPrintId": bookPrintId});
        if(!bookBorrowed) {
            return res.status(400).json({ errors: [{author: "The book wasn't borrowed."}], message: "Something went wrong."});
        }
        let bookPrint = await BookPrint.findOne({"_id": bookPrintId});


        bookBorrowed.remove().then(() => {
            bookPrint!.borrowed = false;
            bookPrint!.save().then(() => {
                return res.status(200).json({message: "Book was returned succesfully."});
            })
        }).catch(e => {
            return res.status(500).json({message: "Something went wrong.", error: e});
        });
    }
)



export default router;