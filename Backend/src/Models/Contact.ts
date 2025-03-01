import mongoose from "mongoose";
import * as validator from "validator";

export interface IContact extends mongoose.Document{
        name : string,
        email : string,
        message: string,
        phone: number
}
const contactSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value : string){
            if (!validator.isEmail(value)){
                throw  new Error('Email is not valid')
            }
        }
    },
    message : {
        required: true,
        type: String,
        trim: true,
        minLength: [10, 'Message must be at least 10 characters']
    },
    phone: {
        type: Number,
        required: true,
        min: [10, 'Invalid phone number']
    }
})

const Contact = mongoose.model<IContact>('contact', contactSchema);
export default Contact;