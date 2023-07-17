import express, {Express, Request, response, Response} from 'express';
import userRouter from './routers/user';
import {dbconnect} from "./db/connect";
import sellerRouter from "./routers/Seller"
import categoryRouter from './routers/Category';
import productRouter from './routers/product'
import adminRouter from './routers/admin';
import * as http from "http";
import cors from 'cors'
import {Server, Socket} from "socket.io";
import cron from 'node-cron';
import {
    deleteInvalidProductActivity, deleteInvalidProductOrders, deleteInvalidProductRefund,
    deleteInvalidProductsRating, deleteInvalidProductsReviews,
    deleteInvalidStores,
    handleSetSellerRep,
    updateActivity,
    updateCart,
    updateHotdeals,
    updateOrders,
    updateShipping,
    updateStoreActivity
} from "./Helpers/helpers";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import Message from "./Models/Message";
import Stripe from 'stripe';
const app  : Express = express();
export const stripe : Stripe   = new Stripe(process.env.SECRETKEY as string, {
    apiVersion: "2022-08-01"
})

app.use(cors({origin: true}))
const server = http.createServer(app);
const io : Server = new Server(server, {
cors :{
    origin: '*'
}
})
dbconnect

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// app.all('*', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "*"); 
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
cron.schedule('*/2 * * * *', () => {
    //this will run every two minutes
    updateOrders();
    deleteInvalidStores()
    // deleteInvalidProductsRating()
    // deleteInvalidProductActivity()
    // deleteInvalidProductRefund()
    // deleteInvalidProductOrders()
});
cron.schedule('*/10 * * * *', () => {
    //this will run every 10 minutes
    updateHotdeals()
})


cron.schedule('*/5 * * * *', () => {
    // this will run every 5 minutes
    updateStoreActivity()
})
cron.schedule('*/10 * * * *', async () => {
    //this will run every 10 minutes
   await updateCart()
})
cron.schedule('0 0 0 * * *', () => {
    //this will run every day at 12 am
    updateShipping()
    updateActivity()
    handleSetSellerRep()
});
const port = process.env.PORT;

//webhooks event for receiving stripe subscription

app.post('/webhooks', express.raw({type: 'application/json'}), (req : Request, res : Response) => {
    // @ts-ignore
    const sig  : string | string[] | Buffer =  req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret as string);
    }
    catch (err : any) {
        response.status(400).send(`webhook error : ${err.message}`)
        return
    }
    //handling the event
    switch (event.type){
        case  'customer.subscription.created' :
            const subscription = event.data.object;
            console.log(subscription)
            break;
        case 'customer.subscription.deleted' :
            const subscription1 = event.data.object;
            console.log(subscription1)
            break;
        case 'customer.subscription.updated' :
            const  subscription2 = event.data.object;
            console.log(subscription2);
            break;
        default :
            console.log(`unhandled event type ${event.type}`)
    }
    response.status(200).send()
})
export type Idata = {
    message: string,
    from: mongoose.Types.ObjectId,
    to : mongoose.Types.ObjectId,
}
type INotify = {
    message: string,
    from: mongoose.Types.ObjectId | string,
    to: mongoose.Types.ObjectId,
    isRead: boolean
}
type Isockets = {
    socket : Socket,
    user : mongoose.Types.ObjectId;
}
const totalSockets : Isockets[] = [];
io.on('connection', (socket : Socket) => {
    console.log(`user ${socket.id} has connected`)
    socket.on('disconnect', () => {
        // console.log(`user ${socket.id}`)
        const existingSocket : number =  totalSockets.findIndex(total => total.socket === socket);
        if (existingSocket !== -1){
         const deletedSocket =   totalSockets.splice(existingSocket, 1)[0];
         console.log(deletedSocket)
        }
    })
    let id : string = socket.id;
    socket.on('startMessage', (data : Idata) => {
        sendMessage(data)
    })
    socket.on('startNotify', (data : INotify) => {
        pushNotification(data)
    })
    socket.on('join', (user: string ) => {
        totalSockets.unshift(<Isockets>{
            socket,
            user: new ObjectId(user)
        })
    })

})
const sendMessage = ({message, to, from} : Idata) => {
    const userToSockets = totalSockets.filter(socket => socket.user === to);
    const listenerSockets = totalSockets.filter(socket => socket.user === from);
    const data : Idata = {
        message,
        to,
        from
    }
    userToSockets.forEach(userData => {
        const {socket} = userData;
        socket.emit('sendMessage', data)
    })
    listenerSockets.forEach(userData => {
        const {socket} = userData;
        socket.emit('sendMessage', data)
    })
   saveMessage({message, to, from})
}
const pushNotification = ({message, to, from, isRead} : INotify) => {
    const userToSockets = totalSockets.filter(socket => socket.user === to);
    userToSockets.forEach(userData => {
        const {socket} = userData;
        socket.emit('sendNotification', {message, to, from, isRead})
    })
}
const saveMessage = async ({message, to, from} : Idata) => {
    const new_message = new Message({
        message,
        to,
        from
    })
    try {
        await new_message.save()
    }
    catch (e) {
        console.log(e)
    }
}
app.use(express.json())//allows us to parse incoming request to json

app.use(userRouter);
app.use(adminRouter);
app.use(categoryRouter);
app.use(sellerRouter);
app.use(productRouter);

server.listen(port, () => {
    console.log('running on port ' +  ' ' +  port)
})
