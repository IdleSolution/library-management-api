import { Document } from "mongoose";
import mongoose from "mongoose";

export interface IBook extends Document {
    title: string,
    isbn: string,
    authorsId: mongoose.Types.ObjectId[],
    genres: string[]
}

export interface IBookPrint extends Document {
    bookId: mongoose.Types.ObjectId,
    quality: string,
    language: string,
    borrowed: boolean

}

export interface IBookBorrowed extends Document {
    bookPrintId: mongoose.Types.ObjectId,
    borrowerId: mongoose.Types.ObjectId,
    borrowedDate: Date,
    dueDate: Date,
}