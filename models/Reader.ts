import { Model, model, Schema } from 'mongoose';
import { IReader } from '../interfaces/IReader';

const readerSchema: Schema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    pesel: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    }
    
});

export const ReaderModel: Model<IReader> = model<IReader>('Reader', readerSchema);