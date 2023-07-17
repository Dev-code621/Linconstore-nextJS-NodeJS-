import mongoose, {Schema} from "mongoose";
export  interface INotication extends mongoose.Document{
    to: mongoose.Types.ObjectId,
    from: mongoose.Types.ObjectId | string,
    message: string,
    isRead: boolean
}

const noticationSchema = new mongoose.Schema({
    to: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    from : {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
})

const Notification =  mongoose.model<INotication>('notifications', noticationSchema)

export default Notification;