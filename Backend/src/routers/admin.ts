import express, { Request, Response, Router } from "express";
import { adminAuth } from "../Middleware/auth";
import Contact, { IContact } from "../Models/Contact";
import User, { Iuser } from "../Models/User";
import Admin, { IAdmin } from "../Models/Admin";
import Order, { IOrder } from "../Models/Order";
import {
    days_passed,
    deactivateSellerProducts,
    findIfAdminExist,
    generateRandomX,
    getBiggestNumber, getOrdersRange, getSellerRange, getTotalSales, getUserRange,
    replaceNull, round, sendOrderDeliveryNotification,
    validateAdmin
} from "../Helpers/helpers";
import Seller, { Iseller } from "../Models/Seller";
import Rating, { IRating } from "../Models/Rating";
import Refund, { IRefund } from "../Models/Refund";
import Store, { IStore } from "../Models/Store";
import Product, { IProduct } from "../Models/Product";
import RequestFile from "../Models/RequestFile";
import {getLastweek, getMonthStartDates, getTimeDiff, roundUpNumber} from "../Helpers/TimeDiff";
import Notification from "../Models/Notication";
import { generateOtp } from "../Helpers/generateOtp";
import { ReUpdateIdentityVerification, UpdateIdentityVerification, UpdateVerificationSuccessful, verifyAdmin } from "../Helpers/verifyUser";
import Category from "../Models/Category";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import Activity from "../Models/Activity";
import Review from "../Models/Review";

interface myData {
    seller: Iseller,
    balance: number,
    length: number
}
const router: Router = express.Router();
router.get('/contacts', adminAuth, async (req: Request, res: Response) => {
    try {
        const contacts: IContact[] = await Contact.find({});
        res.status(200).send(contacts)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.post('/admin/create', async (req: Request, res: Response) => {
    const username: string = generateRandomX(5)
    const admin = new Admin({ ...req.body, username })
    try {
        await admin.save()
        const token: string = await admin.generateAuthToken();
        res.status(200).send({ admin, token })
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.patch('/admin/edit/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    const updates: string[] = Object.keys(req.body);
    const existing: string[] = ['section', 'email', 'password', '_id'];
    const isAllowed: boolean = updates.every(update => existing.includes(update));
    if (!isAllowed) {
        return res.status(401).send('Invalid updates');
    }
    try {
        const admin: IAdmin | null = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send('Not found')
        }
        updates.forEach(update => (admin as any)[update] = req.body[update]);
        await admin?.save()
        res.status(200).send(admin)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/admin/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const admin = await Admin.findByIdAndDelete(id);
        res.status(200).send(admin)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admins', adminAuth, async (req: Request, res: Response) => {
    try {
        const admins: IAdmin[] = await Admin.find({});
        res.status(200).send(admins);
    }
    catch (e) {
        res.status(401).send(e)
    }
})
router.get('/admin/id/:id', adminAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findById(id);
        res.status(200).send(admin)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admin/stores', adminAuth, async (req: Request, res: Response) => {
    try {
        const stores: IStore[] = await Store.find({});
        res.status(200).send(stores)
    }
    catch (e) {
        res.status(500).send({ message: 'Something went wrong' })
    }
})
router.post('/admin/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const otp = generateOtp();
    try {
        const admin: IAdmin = await Admin.findByCredentials(email, password);
        admin.otp = otp;
        await verifyAdmin(otp, admin.email)
        await   admin.save();
        res.status(200).send(admin);
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ status: 'Unable to login' })
    }
})
router.post('/admin/verify', async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {
        const admin: IAdmin = await findIfAdminExist(email);
        const adminVerify = await validateAdmin(parseInt(otp), admin._id)
        if (adminVerify) {
            const token = await adminVerify.generateAuthToken();
            return res.status(200).send({ adminVerify, token })
        }
        res.status(401).send({ status: 'Something went wrong' });
    } catch (e) {
        res.status(400).send({ status: e })
    }
})
// router.get('/admin/orders', adminAuth, async (req: Request, res: Response) => {
//     const status = req.query.status;
//     try {
//         const orders: IOrder[] = await Order.find({ status });
//         res.status(200).send(orders);
//     }
//     catch (e) {
//         res.status(401).send(e)
//     }
// })
router.get('/admin/allorders', adminAuth, async (req: Request, res: Response) => {
    try {
        const orders: IOrder[] = await Order.find({}).populate({
            path: 'productId',
            model: Product
        })
        res.status(200).send(orders);
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/admin/cancel/order/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const order: IOrder | null = await Order.findById(id);
        if (!order) {
            return res.status(404).send('Order Not found')
        }
        const date = getTimeDiff(order.createdAt);
        if (date > 12) {
            return res.status(401).send('Sorry time has elapsed')
        }
        order.status = 'cancelled';
        order.save();
        const notification = new Notification({
            to: order.userId,
            from: 'System',
            message: `Your order ${order._id} has been cancelled `
        })
        notification.save();
        res.status(200).send(date);
    }
    catch (e) {
        res.status(500).send(e)
    }
})
// router.get('/admin/user/stats', adminAuth, async (req: Request, res : Response) => {
//     try {
//         const lastweek  : Date = getLastweek(7);
//         const users =  await  User.find({
//             createdAt : {
//                 $gte: Date.now(),
//                 $lte: lastweek
//             }
//         })
//
//     }
// })
router.get('/admin/user/stats', async (req: Request, res: Response) => {
    try {
        const lastweek: Date = getLastweek(7);
        const twoWeeks: Date = getLastweek(14);

        const sellersLastWeek = await getSellerRange(lastweek, Date.now());
        const sellersTwoWeeks = await getSellerRange(twoWeeks, lastweek);
        const userLastWeek: Iuser[] = await getUserRange(lastweek, Date.now());
        const userTwoWeeks: Iuser[] = await getUserRange(twoWeeks, lastweek);
        const userPrev: number = userTwoWeeks.length;
        const userNext: number = userLastWeek.length;
        const sellerPrev: number = sellersTwoWeeks.length;
        const sellerNext: number = sellersLastWeek.length;
        const userStats: number = replaceNull((100 - (100 / getBiggestNumber(userPrev, userNext, true)) * getBiggestNumber(userPrev, userNext, false)))
        const sellerStats: number = replaceNull((100 - (100 / getBiggestNumber(sellerPrev, sellerNext, true)) * getBiggestNumber(sellerPrev, sellerNext, false)));
        const userSign: boolean = userNext > userPrev;
        const sellerSign: boolean = sellerNext > sellerPrev;
        const orderLastWeek: IOrder[] = await getOrdersRange(lastweek, Date.now())
        const orderTwoWeeks: IOrder[] = await getOrdersRange(twoWeeks, lastweek);
        const orderPrev: number = orderTwoWeeks.length
        const orderNext: number = orderLastWeek.length;
        const orderStats: number = replaceNull((100 - (100 / getBiggestNumber(orderPrev, orderNext, true)) * getBiggestNumber(orderPrev, orderNext, false)))
        const orderSign: boolean = orderNext > orderPrev;
        res.status(200).send({ userNext, sellerNext, orderNext, userStats, sellerStats, userSign, sellerSign, orderSign, orderStats })
    }
    catch (e) {
        res.status(500).send(e)
    }
})

// router.get('/admin/orders/yearlystats', adminAuth, async (req: Request, res: Response) => {
//     const getLastMonth = getLastweek(28);
//     const getLast2Month = getLastweek(28 * 2);
//     const getLast3Month = getLastweek(28 * 3);
//     const getLast4Month = getLastweek(28 * 4);
//     const getLast5Month = getLastweek(28 * 5);
//     const getLast6Month = getLastweek(28 * 6);
//     try {
//         const now: number = Date.now();
//         const orderLastMonth: IOrder[] = await getOrdersRange(getLastMonth, now)
//         const orderLast2Month: IOrder[] = await getOrdersRange(getLast2Month, getLastMonth);
//         const orderLast3Month: IOrder[] = await getOrdersRange(getLast3Month, getLast2Month);
//         const orderLast4Month: IOrder[] = await getOrdersRange(getLast4Month, getLast4Month);
//         const orderLast5Month: IOrder[] = await getOrdersRange(getLast5Month, getLast4Month);
//         const orderLast6Month: IOrder[] = await getOrdersRange(getLast6Month, getLast5Month);
//         const dec: number = getTotalSales(orderLastMonth);
//         const nov: number = getTotalSales(orderLast2Month);
//         const oct: number = getTotalSales(orderLast3Month);
//         const sept: number = getTotalSales(orderLast4Month);
//         const aug: number = getTotalSales(orderLast5Month);
//         const july: number = getTotalSales(orderLast6Month);
//         res.status(200).send({ dec, nov, oct, sept, aug, july })
//     }
//     catch (e) {
//         res.status(500).send(e)
//     }
// })
router.get('/admin/delete/stores', async (req: Request, res: Response) => {
    try {
        const sellers: Iseller[] = await Seller.find({});
        let sellerLength = sellers.length;
        for (sellerLength; sellerLength--;) {
            const { _id } = sellers[sellerLength]
            const store: IStore | null = await Store.findOne({ owner: _id });
            if (!store) {
                sellers[sellerLength].delete()
            }
        }
        res.status(200).send('ok')
    }
    catch (e) {
        res.status(200).send(e)
    }
})
router.get(`/admin/orders/stats`,  adminAuth , async (req: Request, res: Response) => {
    const days: number = days_passed(new Date())
    const lastYear = getLastweek(days);
    try {
        const now: number = Date.now();
        const orderLastYear: IOrder[] = await getOrdersRange(lastYear, now);
        const totalSales: number = getTotalSales(orderLastYear);
        res.status(200).send({ totalSales, totalOrders: orderLastYear.length })
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admin/yearly', async (req: Request, res: Response) => {
     const months = getMonthStartDates() as Date []
    try {
        const data: number[] = [];
        if (months.length === 1) {
            const orderLast: IOrder[] = await getOrdersRange(months[0], Date.now());
            const getTotalSale = getTotalSales(orderLast);
            data.push(round(getTotalSale));
            return res.status(200).send(data)
        }
        for (let i = 0; i < months.length; i++) {
            if(i + 1 === months.length) continue
            const orderLast: IOrder[] = await getOrdersRange(months[i], months[i + 1]);
            const getTotalSale = getTotalSales(orderLast);
            data.push(roundUpNumber(getTotalSale));
        }
        res.status(200).send(data)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
const getMonthName = (monthNumber: number) => {
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    return monthNames[monthNumber - 1];
};
// router.get('/admin/yearly/2', async (req: Request, res: Response) => {
//
//     try {
//         const date = new Date();
//         const currentMonth = date.getMonth() + 1;
//         const currentYear = date.getFullYear();
//         const monthNames = [...Array(12).keys()].map((i) => {
//             const d = new Date(currentYear, currentMonth - i - 1, 1);
//             return d.toLocaleString('default', { month: 'long' });
//         }).reverse();
//
//         const orders = await Order.aggregate([
//             {
//                 $match: {
//                     createdAt: { $gte: new Date(currentYear - 1, currentMonth - 1, 1) },
//                 },
//             },
//             {
//                 $group: {
//                     _id: {
//                         month: { $month: '$createdAt' },
//                     },
//                     count: { $sum: 1 },
//                 },
//             },
//             {
//                 $project: {
//                     month: {
//                         $concat: [
//                             { $toString: { $month: '$createdAt' } },
//                             '-',
//                             { $toString: { $year: '$createdAt' } }
//                         ]
//                     },
//                     createdAt: 1,
//                     count: 1,
//                     _id: 0,
//                 },
//             },
//         ]);
//
//         const result = {};
//         monthNames.forEach((name) => {
//             (result as any)[name] = 0;
//         });
//         console.log(orders)
//         orders.forEach((order) => {
//             console.log(order)
//             const monthName = new Date(`${order.month}-01`).toLocaleString('default', { month: 'long' });
//             (result as any)[monthName] = order.count;
//         });
//
//             console.log(result)
//         }
//     catch (e) {
//         res.status(500).send(e)
//     }
// })
// I am building an API for an ecommerce website, the job of this api is to fetch all orders for the past 12 months i.e the past 12 month from today is last year april -march, the response should include the orders for each month e.g. april : 12, may: 2 e.t.c. h
// router.get('/admin/orders/yearlystats/2', adminAuth, async (req: Request, res: Response) => {
//     const getLast6Month = getLastweek(28 * 6);
//     const getLast7Month = getLastweek(28 * 7);
//     const getLast8Month = getLastweek(28 * 8);
//     const getLast9Month = getLastweek(28 * 9);
//     const getLast10Month = getLastweek(28 * 10);
//     const getLast11Month = getLastweek(28 * 11);
//     const getLast12Month = getLastweek(28 * 12);
//     try {
//         const orderLast7Month: IOrder[] = await getOrdersRange(getLast7Month, getLast6Month)
//         const orderLast8Month: IOrder[] = await getOrdersRange(getLast8Month, getLast7Month);
//         const orderLast9Month: IOrder[] = await getOrdersRange(getLast9Month, getLast8Month);
//         const orderLast10Month: IOrder[] = await getOrdersRange(getLast10Month, getLast11Month);
//         const orderLast11Month: IOrder[] = await getOrdersRange(getLast11Month, getLast10Month);
//         const orderLast12Month: IOrder[] = await getOrdersRange(getLast12Month, getLast11Month);
//         const jun: number = getTotalSales(orderLast7Month);
//         const may: number = getTotalSales(orderLast8Month);
//         const april: number = getTotalSales(orderLast9Month);
//         const march: number = getTotalSales(orderLast10Month);
//         const feb: number = getTotalSales(orderLast11Month);
//         const jan: number = getTotalSales(orderLast12Month);
//         res.status(200).send({ jan, feb, march, april, may, jun })
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
router.get('/admin/user/stats', adminAuth, async (req: Request, res: Response) => {
    try {
        const lastweek: Date = getLastweek(7);
        const sellers = await Seller.find({
            createdAt: {
                $gte: Date.now(),
                $lte: lastweek
            }
        })
        res.status(200).send(sellers)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admin/user', adminAuth, async (req: Request, res: Response) => {
    try {
        const seller = await User.find({});
        res.status(200).send(seller)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admin/ratings', adminAuth, async (req: Request, res: Response) => {
    try {
        const ratings = await Review.find({}).populate({
            model: Store,
            path: 'owner'
        }).populate({
            path: 'productId',
            model: Product
        });
        res.status(200).send(ratings);
    }
    catch (e) {
        res.status(401).send(e)
    }
})
router.get('/admin/refund', adminAuth, async (req: Request, res: Response) => {
    try {
        const refunds: IRefund[] = await Refund.find({}).populate({
            path: 'storeId',
            model: Store
        }).populate({
            path: 'userId',
            model: User
        });
        res.status(200).send(refunds);
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.patch('/admin/refund/:id', adminAuth, async (req: Request, res: Response) => {
    const status: string = req.body.status;
    const id = req.params.id;
    try {
        const refund: IRefund | null = await Refund.findById(id);
        if (!refund) {
            return res.status(404).send('Not Found')
        }
        refund!.status = status
        await refund!.save();
        res.status(200).send(refund)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/admin/refund/:id', adminAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const refund = await Refund.findByIdAndDelete(id);
        res.status(200).send(refund)
    }
    catch (e) {
        res.status(400).send(e) 
    }
})
router.get('/admin/products', adminAuth, async (req: Request, res: Response) => {
    try {
        const products: IProduct[] = await Product.find({active: true}).where('quantity').gt(0).populate({
            path: 'category',
            model: Category
        });
        res.status(200).send(products)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.patch('/admin/product/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    const updates = Object.keys(req.body);
    const existing: string[] = ['active'];
    const isAllowed: boolean = updates.every(update => existing.includes(update));
    if (!isAllowed) {
        return res.status(403).send('Invalid updates')
    }
    try {
        const product: IProduct | null = await Product.findById(id);
        if (!product) return res.status(404).send('Product does not exist')
        product.active = !product.active;
        product.save()
        const products = await Product.findByIdAndUpdate(id, { active: req.body.active });
        res.status(200).send(products);
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admin/users', adminAuth, async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        let usersLength: number = users.length;
        const newUsers = [];
        for (usersLength; usersLength--;) {
            const order: IOrder[] = await Order.find({ userId: users[usersLength]._id });
            newUsers.push({ users: users[usersLength], no: order.length })
        }
        res.status(200).send(users)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/admin/user/:id', adminAuth, async (req: Request, res: Response) => {
    // const updates = Object.keys(req.body);
    const id = req.params.id;
    // const existing : string [] = ['isVerified'];
    // const isAllowed : boolean = updates.every(update => existing.includes(update));
    // if (!isAllowed){
    //     return res.status(402).send('Invalid updates')
    // }
    try {
        const user: Iuser | null = await User.findById(id);
        if (!user) return res.status(404).send('Not found')
        user.isVerified = !user.isVerified;
        user.save()
        res.status(200).send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/admin/user/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        res.status(200).send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})
interface IAdminSeller {
    store: IStore,
    length: number
}
router.get('/admin/sellers', adminAuth, async (req: Request, res: Response) => {
    try {
        const store : IStore [] = await Store.find({}).populate({
            path: 'owner',
            model: Seller
        });
        if(store.length === 0) return res.status(200).send([])
        let storeLength = store.length;
        console.log(store)
        const newData  : IAdminSeller[]= []
        for(storeLength; storeLength--;){
            const _id = store[storeLength]?._id;
            const products : IProduct[] =  await Product.find({owner: _id});
            newData.push({length: products.length, store: store[storeLength]})
        }
        res.status(200).send(newData);
    }
    catch (e) {
        res.status(500).send(e)

    }
})
router.patch('/admin/seller/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    const status = req.body.status;
    try {
        const store: IStore | null = await Store.findById(id);
        if (!store) res.status(404).send('Not found')
        store!.isVerified = !store!.isVerified;
        const seller = await Seller.findOne({ storeId: store?._id })
        // @ts-ignore
        seller?.isVerified = !seller?.isVerified
        await store!.save()
        seller?.save()
        res.status(200).send()
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.delete('/admin/seller/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    const _id = new ObjectId(id)
    try {
        const store: IStore | null = await Store.findById(_id);
        if (!store) {
            return res.status(404).send('Not Found');
        }
        const seller = await Seller.findOne({ storeId: store._id });
        const user: Iuser | null = await User.findOne({ sellerId: seller?._id });
        await user?.save()
        await Product.deleteMany({ owner: store!._id })
        await Store.findByIdAndDelete(id);
        res.status(200).send(store);
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.get('/admin/reviews', adminAuth, async (req: Request, res: Response) => {
    try {
        const sellers: Iseller[] = await Seller.find({}).populate({ path: 'storeId', model: Store }).populate({
            path: 'owner',
            model: User
        });
        const newData: myData[] = [];
        let sellerLength: number = sellers.length;
        for (sellerLength; sellerLength--;) {
            const { storeId: store_id } = sellers[sellerLength];
            const store: IStore | null = await Store.findById(store_id);
            const order : IOrder[] | null =  await Order.find({sellerId: store_id});
            const totalSales : number = getTotalSales(order);
            if (!store) continue;
            const products: IProduct[] = await Product.find({ owner: store!._id });
            const productLength: number = products.length;
            newData.push({ seller: sellers[sellerLength], length: productLength, balance: totalSales })
        }
        res.status(200).send(newData)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.patch('/admin/review/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const seller: Iseller | null = await Seller.findOne({ _id: id });
        if (!seller) {
            return res.status(404).send('Not found')
        }
        seller!.isVerified = !seller.isVerified;
        await seller!.save();
        const store: IStore | null = await Store.findOne({ owner: seller!._id });
        if (!store) {
            return res.status(404).send('Not found')
        }
        store!.isVerified = !store.isVerified;
        await store!.save()
        await deactivateSellerProducts(store)
        res.status(200).send()
    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.patch('/admin/seller/active/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id, active = req.query.active, isActive = active === 'true';
    const _id = new ObjectId(id)
    try {
        if(active){
            const request = await RequestFile.findOne({sellerId: _id});
            await request?.delete()
        }
        const seller = await Seller.findByIdAndUpdate(id, { isActive });
        const user = await User.findOne({sellerId: _id})
        const email = user!.email
        const name = user!.firstName;
        isActive ?  UpdateVerificationSuccessful(email, name) : ReUpdateIdentityVerification(email, name)
        res.status(200).send(seller)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/admin/review/:id', adminAuth, async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        await Store.findByIdAndDelete(id);
        res.status(200).send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admin/feedbacks', adminAuth, async (req: Request, res: Response) => {
    try {
        const contacts = await Contact.find({});
        res.status(200).send(contacts)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.post('/admin/request', adminAuth, async (req: Request, res: Response) => {
    const {sellerId} = req.body;
    try {
          await Seller.findByIdAndUpdate(sellerId, {isActive: false})
         const user : Iuser | null = await User.findOne({sellerId}) 
         
         const email: string = user?.email as string;
         const name = user!.firstName;
         await UpdateIdentityVerification(email, name)
        const request = new RequestFile(req.body);
        await request.save();
        res.status(201).send(request)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.post('/admin/payout', adminAuth, async (req: Request, res: Response) => {
    const { type: name, amount, storeId } = req.body;
    try {
        const store: IStore | null = await Store.findById(storeId);
        if (!store) res.status(404).send({ message: 'Store does not exist' });
        if (amount > store!.balance) return res.status(400).send({ message: 'Seller does not have up to this amount' });
        if(store!.balance - amount < 0)  return res.status(400).send({ message: 'cant deduct up to this amount' });
        store!.balance = store!.balance - amount;
        await store?.save()
        const activity = new Activity({
            name,
            bill: amount,
            type: 'debit',
            sellerId: store?._id
        })
        await activity.save()
        res.status(200).send(store)

    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }

})

router.post('/admin/send/delivery', adminAuth, async (req: Request, res : Response) => {
        try {
                await sendOrderDeliveryNotification()
                res.status(200).send()
        }
        catch (e) {
            res.status(500).send(e)
        }
})
router.delete('/admin/request/:id', adminAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        RequestFile.findByIdAndDelete(id);
        res.status(200).send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.delete('/admin/products/delete', adminAuth, async (req: Request, res: Response) => {
    try {
        const deletedProducts = await Product.deleteMany();
        res.status(200).send(deletedProducts)
    }
    catch (e) {
        res.status(500).send(e)
    }
});

router.delete('/admin/product/:id', adminAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // const order: IOrder | null = await Order.findOne({ productId: id });
        // if (order) return res.status(400).send({ message: 'Cant delete a product that has been ordered' })
        const product: IProduct | null = await Product.findById(id);
        await Review.deleteMany({ productId: id });
        await Rating.deleteMany({ productId: id });
        await Order.deleteMany({ productId: id });
        await Activity.deleteMany({ productId: id });
        await product?.delete()
        res.status(200).send(product);
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/admin/order/:id', adminAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndUpdate(id, { status: 'cancelled' });
        res.status(200).send(order);
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/admin/products/stat', adminAuth, async (req: Request, res: Response) => {
    try {
        const products: IProduct[] = await Product.find({ active: true });
        res.status(200).send(products.length)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
export default router;