import { Model, model, Schema } from 'mongoose';
import { IAuthor } from '../interfaces/IAuthor';

const authorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
})

export const AuthorModel: Model<IAuthor> = model<IAuthor>('Author', authorSchema);