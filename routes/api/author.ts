import express from "express";
import { body, validationResult } from "express-validator";
import { AuthorModel as Author } from "./../../models/Author";

const router = express();

// @route   POST api/author/new
// @desc    Adds a new author
router.post(
    "/new",
    body("firstName").exists(),
    body("lastName").exists(),
    (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const author = new Author();
        const { firstName, lastName } = req.body;

        author.firstName = firstName;
        author.lastName = lastName;
        
        author.save().then(() => {
            return res.status(200).json({message: "Succesfully added an author to the database."});
        }).catch(e => {
            return res.status(500).json({message: "Something went wrong.", error: e})
        })

})



export default router;