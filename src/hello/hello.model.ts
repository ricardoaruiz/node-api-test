import mongoose from 'mongoose';

export interface HelloDocument {
    _id?: string,
    message: string,
    active: boolean
}

const HelloSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
    },
    active: {
        type: Boolean,
        required: true,
    }
});

const HelloModel = mongoose.model('Hello', HelloSchema);
export default HelloModel;
