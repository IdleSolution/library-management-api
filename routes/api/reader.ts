import express from "express";
import { ReaderModel as Reader } from "../../models/Reader";
import { BookBorrowedModel as BookBorrowed } from "../../models/BookBorrowed";
import { BookModel as Book } from "../../models/Book";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

// @route   POST api/reader/new
// @desc    Adds a new reader
// @body    firstName, lastName, birthday (date in a YYYY-DD-MM format), pesel, email, phone
router.post(
    '/new', 
    body('firstName').exists(),
    body('lastName').exists(),
    body('birthday').exists(),
    body('pesel').exists().isLength({min: 11, max: 11}),
    body('email').exists().isEmail(),
    body('phone').exists().isMobilePhone("pl-PL"),
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let reader = new Reader();

        let { firstName, lastName, birthday, pesel, email, phone } = req.body;
        birthday = new Date(birthday);
        reader.firstName = firstName;
        reader.lastName = lastName;
        reader.birthday = birthday;
        reader.pesel = pesel;
        reader.email = email;
        reader.phone = phone;

        reader.save().then(() => {
            return res.status(200).json({message: "Succesfully added a reader to the database."});
        }).catch(e => {
            return res.status(500).json({message: "Something went wrong.", error: e})
        })
})

// @route   GET api/reader/borrowed
// @desc    Returns a list of all borrowed books of a single reader
// @body    readerId
router.get(
    "/borrowed", 
    body("readerId").exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { readerId } = req.body;
        readerId = new mongoose.Types.ObjectId(readerId);
        const count = await Reader.count({"_id": readerId});
        if(count !== 1) {
            return res.status(400).json({ errors: [{author: "Could not find the reader in the database."}], message: "Something went wrong."});
        }

        const borrowed = await BookBorrowed.find({"borrowerId": readerId}).populate({
            path: "bookPrintId",
            populate: {
                path: "bookId"
            }
        })
        if(borrowed.length === 0) {
            return res.status(200).json({message: "The reader hasn't borrowed any books yet"});
        }

        return res.status(200).json(borrowed);
})


export default router;