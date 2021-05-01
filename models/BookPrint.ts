import { Model, model, Schema } from 'mongoose';
import { IBookPrint } from '../interfaces/IBook';
import mongoose from "mongoose";

const bookPrintSchema = new Schema({
    bookId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Book"
    },
    quality: String,
    language: {
        type: String,
        required: true
    },
    borrowed: {
        type: Boolean,
        default: false
    }
})

export const BookPrintModel: Model<IBookPrint> = model<IBookPrint>('BookPrint', bookPrintSchema);