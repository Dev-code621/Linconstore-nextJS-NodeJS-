import mongoose from "mongoose";

export interface IMessage {
    to: mongoose.Types.ObjectId,
    from: mongoose.Types.ObjectId | string,
    message: string
}
const messageSchema = new mongoose.Schema({
    to : {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    from: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
})

const Message = mongoose.model<IMessage>('messages', messageSchema)
export default Message;