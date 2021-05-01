import { Model, model, Schema } from 'mongoose';
import { IBookBorrowed } from '../interfaces/IBook';
import mongoose from "mongoose";

const bookBorrowedSchema = new Schema({
    bookPrintId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "BookPrint"
    },
    borrowerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Reader"
    },
    borrowedDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
})

export const BookBorrowedModel: Model<IBookBorrowed> = model<IBookBorrowed>('BookBorrowed', bookBorrowedSchema);