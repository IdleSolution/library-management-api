import { Document } from "mongoose";
 
export interface IReader extends Document {
    firstName: string,
    lastName: string,
    birthday: Date,
    pesel: string,
    email: string,
    phone: string
}