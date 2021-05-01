import express from "express";

import { body, validationResult } from "express-validator";
import { Schema } from "mongoose";
import { BookModel as Book } from "../../models/Book";
import { AuthorModel as Author } from "../../models/Author";
import mongoose from "mongoose";


const router = express.Router();

// @route   POST api/book/new
// @desc    Adds a new book
// @body    title, isbn, authorsId (array), genres (array)
router.post(
    '/new',
    body("title").exists(),
    body("isbn").exists(),
    body("authorsId").exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, isbn, authorsId, genres } = req.body;
        let arr: string[] = JSON.parse(authorsId);
        let authorsIdArr: mongoose.Types.ObjectId[] = arr.map(x => new mongoose.Types.ObjectId(x));

        let count = await Author.count(
            {"_id": { $in: authorsIdArr }}
        )
        if(count !== authorsIdArr.length) {
            return res.status(400).json({ errors: [{author: "Could not find all given authors in the database"}], message: "Something went wrong" })
        }


        let book = new Book();
        book.title = title;
        book.isbn = isbn;
        book.authorsId = authorsIdArr;

        if(genres !== undefined) {
            let genresArr: string[] = JSON.parse(genres);
            book.genres = genresArr;
        }

        book.save().then(() => {
            return res.status(200).json({message: "Succesfully added a Book to the database."});
        }).catch(e => {
            return res.status(500).json({message: "Something went wrong.", error: e})
        })
    
})


// @route   GET api/book/author
// @desc    Returns all books written by a single author
// @params  authorId
router.get(
    "/author",
    body("authorId").exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let { authorId } = req.body;
        authorId = new mongoose.Types.ObjectId(authorId);
        let countAuthor = await Author.count({"_id": authorId});
        if(countAuthor !== 1) {
            return res.status(400).json({ errors: [{author: "Could not find the given author in database"}], message: "Something went wrong" })
        }

        const books = await Book.find({"authorsId": { $in: authorId }});

        return res.status(200).json(books);
    }
)

// @route   GET api/book/genre
// @desc    Returns all books with a corresponding genre
// @params  genre
router.get(
    "/genre",
    body("genre").exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let { genre } = req.body;

        const books = await Book.find({"genre": { $in: genre }});

        return res.status(200).json(books);
    }
)


export default router;