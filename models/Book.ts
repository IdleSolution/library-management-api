import { Model, model, Schema } from 'mongoose';
import { IBook } from '../interfaces/IBook';
import mongoose from "mongoose";

const bookSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    authorsId: {
        type: [mongoose.Types.ObjectId],
        required: true,
        ref: "Author"
    },
    genres: {
        type: [String]
    }
});

export const BookModel: Model<IBook> = model<IBook>('Book', bookSchema);