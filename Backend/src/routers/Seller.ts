
import mongoose from "mongoose";
import express, {Request, response, Response, Router} from "express";
import Seller, {Iseller} from "../Models/Seller";
import Store, {IStore, IStoreFun} from "../Models/Store";
import {activeSeller, adminAuth, auth, sellerAuth} from "../Middleware/auth";
import cloudinary from 'cloudinary';
import {DeleteResult, ObjectId} from "mongodb";
import Product, {IProduct} from "../Models/Product";
import Order, {IOrder} from "../Models/Order";
import Refund, {IRefund} from "../Models/Refund";
import RequestFile, {IRequestFile} from "../Models/RequestFile";
import {
    createCheckoutSession, extractDataForOrdersUpdate,
    getOrdersRangeForSeller, getTotalSales, getTotalShippingPrice,
    saveVerifiedSeller
} from "../Helpers/helpers";
import {PriceToPlan, priceToPlan, storePlan} from "../Data/data";
import {stripe} from "../app";
import Stripe from "stripe";
import {welcomeSellers} from "../Helpers/verifyUser";
import Category from "../Models/Category";
import Review from "../Models/Review";
import Ads, {Iads} from "../Models/Ads";
import {adsLimit, CountryCodes} from "../Helpers/constants";
import baseUrl from "../baseurl/baseUrl";
import seller from "../Models/Seller";
import User, {Iuser} from "../Models/User";
import  {IActivity} from "../Models/Activity";
import Activity from "../Models/Activity";
import Address, {IAddress} from "../Models/Address";
import Shipping, {IShipping} from "../Models/Shipping";
import {getLastweek} from "../Helpers/TimeDiff";

const router: Router = express.Router();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPI,
    api_secret: process.env.CLOUDSECRET
})
router.post('/seller', auth, async (req: Request, res: Response) => {
    const seller = new Seller(req.body)
    const owner = req.user._id;
    try {
        // const response : cloudinary.UploadApiResponse =  await cloudinary.v2.uploader.upload(data.image);
        // const file : string = response.secure_url;
        const seller = new Seller({
            ...req.body,
            owner,
        });
        await seller.save()
        req.user.sellerId = seller._id;
        req.user.save()
        res.status(201).send(seller)
    } catch (e) {
        res.send(e)
    }
})

router.post('/seller/test', async (req: Request, res: Response) => {
    const data = {
        image: req.body.image
    }
    try {
        const response: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(data.image);

        res.status(200).send(response);
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/seller/reverify', sellerAuth, async (req: Request, res: Response) => {
    const {file, type} = req.body;
    try {
        req.seller.file = file;
        req.seller.documentType = type
        await req.seller.save();
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/seller/store', sellerAuth, async (req: Request, res: Response) => {
    try {
        const packages = req.seller.package;
        const store = storePlan.find(data => data.plan === packages.toLowerCase());
        const limit = store!.limit;
        const categories = await Category.find({});
        res.status(200).send({limit, categories})
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/seller/sub', sellerAuth, async (req: Request, res: Response) => {
    const subId = req.seller.subId;
    try {
        if (req.seller.package !== 'free'){
            const subscriptionDetails: Stripe.Response<Stripe.Subscription> = await stripe.subscriptions.retrieve(subId);
          return   res.status(200).send({endDate: subscriptionDetails.current_period_end})
        }
        res.status(200).send()
        }
 catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.post('/store', sellerAuth, async (req: Request, res: Response) => {
    // const data = {
    //     image:    req.body.logo
    // };
    const owner = req.seller._id
    // const categories: string[] = req.body.categories;
    const plan = req.seller.package;
    const limit = storePlan.find(data => data.plan === plan.toLowerCase());
    // if (categories.length > limit!.limit) {
    //     return res.status(401).send({status: 'You need to upgrade your account inorder to post more'})
    // }
    // const restricted: boolean = categories.every(datas => limit!.restriction.includes(datas));
    // if (restricted) {
    //     return res.status(400).send({status: 'You are not allowed to use the category, pls upgrade'})
    // }
    try {
        // const response : cloudinary.UploadApiResponse    = await cloudinary.v2.uploader.upload(data.image);
        // const logo = response.secure_url;
        const store = new Store({
            ...req.body,
            isVerified: req.seller.isVerified,
            // logo,
            owner,
            account: req.seller.account
        });
        await store.save()
        req.seller.storeId = store.id;
        await req.seller.save()
        res.status(201).send(store)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/store/delete/:id', sellerAuth, async (req: Request, res: Response) => {
    const id = req.params;
    try {
        const existingSeller = await Store.findOne({
            _id: new ObjectId(id as unknown as mongoose.Types.ObjectId),
            owner: req.seller._id
        });
        if (!existingSeller) {
            return res.status(401).send('Not found')
        }
        const deletedStore = await Store.findByIdAndDelete(existingSeller!._id);
        res.status(200).send(deletedStore)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/store/update', sellerAuth, async (req: Request, res: Response) => {
    const updates: string [] = Object.keys(req.body);
    const existingData = ['name', 'summary', 'logo', 'currency', 'location'];
    const isAllowed: boolean = updates.every(update => existingData.includes(update))
    if (!isAllowed) {
        return res.status(400).send('Invalid updates');
    }
    try {
        const findExisting = await Store.findOne({owner: req.seller._id});
        // const isUpdatingLogo = updates.includes('logo');
        if (!findExisting) {
            return res.status(403).send('No result found')
        }
        // if (isUpdatingLogo){
        //     const data = {
        //         image : req.body.logo
        //     }
        //   const response : cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(data.image);
        // const index1 = updates.indexOf('logo');
        //   updates[index1] = response.secure_url;
        // console.log(updates)
        // console.log(response.secure_url)
        //   findExisting.logo = response.secure_url;
        //   updates.forEach((update, index) =>  index !== index1 ?  (findExisting as any)[update]  :  findExisting.logo =
        //      index !== index1 ?   req.body[update] : response.secure_url);
        //   // updates.forEach((update, index) => {
        //   //     console.log(index === index1)
        //   // });
        // await  findExisting!.save();
        // return res.status(200).send(findExisting);
        // }
        updates.forEach(update => (findExisting as any)[update] = req.body[update]);
        await findExisting!.save();
        res.status(200).send(findExisting)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/seller/order/:id', sellerAuth, async (req: Request, res: Response) => {
    const _id = req.params.id;
    const  status : string | undefined = req.body
    const updates = Object.keys(req.body);
    const existing: string [] = ['name', 'status', 'id', 'trackingId', 'price', 'shippingProvider', 'quantity'];
    try {
        const isAllowed: boolean = updates.every(update => existing.includes(update));
        if (!isAllowed) {
            return res.status(401).send({status: 'Invalid update'});
        }
        const store = await Store.findOne({owner: req.seller._id})
        if (!store) return res.status(404).send({body: 'Store does not exist'});
        const order: IOrder | null = await Order.findOne({sellerId: store!._id, _id})
        if (!order) {
            return res.status(401).send({status: 'Order does not exist'})
        }
        if (!order.active) {
            return res.status(401).send({status: 'Sorry you have to wait until 12 hours before you can update'})
        }
        if (status === 'processed' && !order.updated) {
            const timestamp = Date.now();
            order.updateShipping = new Date(timestamp)
        }
        updates.forEach(update => (order as any)[update] = req.body[update])
        await order.save()
        await extractDataForOrdersUpdate(order)
        res.status(200).send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/seller/:id', sellerAuth, async (req: Request, res: Response) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const existing: string [] = [
        'account',
        'location',
        'documentType',
        'documentId',
        'documentCountry',
        'gender',
        'dob',
        'package',
        'file',
        'isVerified'];
    try {
        const isAllowed: boolean = updates.every(update => existing.includes(update));
        if (!isAllowed) {
            return res.status(401).send('Invalid Updates');
        }
        updates.forEach(update => (req.seller as any)[update] = req.body[update])
        await req.seller.save()
        res.status(200).send(req.seller)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/store/me', sellerAuth, async (req: Request, res: Response) => {
    try {
        const findMyStore = await Store.findOne({owner: req.seller._id});
        if (findMyStore) {
            return res.status(200).send(findMyStore);
        }
        res.status(403).send('Not found')
    } catch (e) {
        res.status(403).send(e)
    }
})

interface Ipackage {
    name: string,
    limit: number
}

const packages: Ipackage [] = [
    {
        name: 'free',
        limit: 150
    },
    {
        name: 'Premium',
        limit: 10000000
    },
]

router.post('/seller/product', activeSeller, async (req: Request, res: Response) => {
    try {
        const plan: Ipackage | undefined = packages.find(packageItem => packageItem.name === req.seller.package.toLowerCase());
        const date: Date = getLastweek(28);
        const store: IStore | null = await Store.findOne({owner: req.seller._id});
        if (!store) {
            return res.status(403).send('Sorry you dont have a store')
        }
        if(!req.seller.isActive){
            return res.status(400).send('Sorry you need to re upload your document')
        }
        const limit: IProduct [] = await Product.find({
            owner: store!._id,
            createdAt: {
                $gte: date,
                $lte: Date.now()
            }
        });
        if (limit.length >= plan!.limit) {
            return res.status(400).send('You need to upgrade in order to post more')
        }
        // const uploader  = async (path : string) => await cloudinary.v2.uploader.upload(path)
        //     const photo = [];
        //     const images : string[] = req.body.photo;
        //     for (const image of images){
        //         const response : cloudinary.UploadApiResponse = await  uploader(image);
        //         photo.push(response.secure_url);
        //     }
        store!.listing = store!.listing + 1;
        await store.save();
        const category = await Category.findOne({title: req.body.category});
        const product = new Product({...req.body, category: category!._id, owner: store?._id});
        product.save();
        res.status(200).send(product)
    } catch (e) {
        console.log(e)
        res.status(401).send(e)
    }
})
router.get('/store/me/products', sellerAuth, async (req: Request, res: Response) => {

    try {
        const store = await Store.findOne({owner: req.seller._id});
        const products = await Product.find({owner: store!._id}).populate({
            path: 'category',
            model: Category
        }).populate('ratingId').sort('desc');
        res.status(200).send(products)
    } catch (e) {
        res.status(400).send(e)
    }
})
type IOrders = {
    order:  IOrder,
    address: IAddress | null
}
router.get('/seller/orders', sellerAuth, async (req: Request, res: Response) => {
    const status = req.query.status;
    try {
        const store: IStore | null = await Store.findOne({owner: req.seller._id});
        const orders: IOrder [] = await Order.find({sellerId: store!._id, status}).populate({
            path: 'productId',
            model: Product
        }).populate({
            path: 'userId',
            model : User
        })
        if (orders.length === 0) {
            return res.status(200).send('No Orders')
        }
        const newOrders : IOrders [] =  [];
        let orderLength : number = orders.length;
        for (orderLength; orderLength--;) {
            const {userId} = orders[orderLength];
            const address : IAddress  | null =  await  Address.findOne({userId});
            const newData  : IOrders = {
                order: orders[orderLength],
                address
            }
            newOrders.push(newData)
        }

        res.status(200).send(newOrders)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/seller/orders/shipped', sellerAuth, async (req: Request, res: Response) => {
    try {
        const store: IStore | null = await Store.findOne({owner: req.seller._id});
        const orders: IOrder [] = await Order.find({sellerId: store!._id}).or([{status: 'shipped'}, {status: 'delivered'}]).populate({
            path: 'productId',
            model: Product
        }).populate({
            path: 'userId',
            model : User

        })
        if (orders.length === 0) {
            return res.status(200).send('No Orders')
        }
        const newOrders : IOrders [] =  [];
        let orderLength : number = orders.length;
        for (orderLength; orderLength--;) {
            const {userId} = orders[orderLength];
            const address : IAddress  | null =  await  Address.findOne({userId});
            const data  : IOrders = {
                order: orders[orderLength],
                address
            }
            newOrders.push(data)
        }

        res.status(200).send(newOrders)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/seller/orders/cancelled', sellerAuth, async (req: Request, res: Response) => {
    try {
        const store: IStore | null = await Store.findOne({owner: req.seller._id});
        const orders: IOrder [] = await Order.find({sellerId: store!._id}).or([{status: 'cancelled'}, {status: 'processed'}]).populate({
            path: 'productId',
            model: Product
        }).populate({
            path: 'userId',
            model: User
        })
        if (orders.length === 0) {
            return res.status(200).send('No Orders')
        }
        const newOrders : IOrders [] =  [];
        let orderLength : number = orders.length;
        for (orderLength; orderLength--;) {
            const {userId} = orders[orderLength];
            const address : IAddress  | null =  await  Address.findOne({userId});
            const newData  : IOrders = {
                order: orders[orderLength],
                address
            }
            newOrders.push(newData)
        }
        res.status(200).send(newOrders)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/seller/order/:id', sellerAuth, async (req: Request, res: Response) => {
    const _id = req.params.id
    try {
        const order = await Order.deleteOne({sellerId: req.seller._id, _id});
        res.status(200).send(order);
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/seller/products', sellerAuth, async (req: Request, res: Response) => {
    const owner = req.seller._id;
    try {
        const products = await Product.find({owner}).sort('desc');
        res.status(200).send(products)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/seller/store/stat', sellerAuth, async (req: Request, res: Response) => {
    // const sellerId = req.seller._id;
    const owner = req.seller._id;
    try {
        const store: IStore | null = await Store.findOne({owner});
        const products: IProduct [] = await Product.find({owner: store!._id});
        const totalProducts: number = products.length;
        const totalVisitors: number | undefined = store?.views;
        const orders : IOrder [] = await Order.find({sellerId: store?._id}).or([{status: 'shipped'}, {status: 'delivered'}, {status: 'processed'}]);
        const totalSales : number = getTotalSales(orders);
        // const totalShipping : IShipping[] = await Shipping.find({storeId: store?._id});
        const totalPrice : number = getTotalShippingPrice(orders);
        const totalOrder : IOrder []   = await Order.find({sellerId: store?._id, status: 'placed'});
        const totalExpenses: number | undefined = store?.expenses
        res.status(200).send({
            totalVisitors, totalProducts, totalSales : totalPrice + totalSales, totalExpenses, totalOrders : totalOrder.length,orders
        })
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/seller/refunds', sellerAuth, async (req: Request, res: Response) => {

    try {
        const store = await Store.findOne({owner: req.seller._id})
        if (!store) return res.status(404).send([])
        const refund: IRefund [] = await Refund.find({storeId: store!._id}).populate({
            model: Product,
            path: 'productId'

        });
        res.status(200).send(refund)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/seller/me', sellerAuth, async (req: Request, res: Response) => {
         res.status(200).send(req.seller)
})
router.get('/seller/request', sellerAuth, async (req: Request, res: Response) => {
    try {
        const request: IRequestFile | null = await RequestFile.findOne({sellerId: req.seller._id}).sort('desc')
        res.status(200).send(request)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/store/unique-name',async (req :Request, res : Response) => {
        const searchQuery = req.query.storename as string;
        const searchTerm = searchQuery.trim();
        const searchRegex = new RegExp(`^${searchTerm}$`, 'i');
    
        try {
            const store = await Store.findOne({ name: searchRegex})
            let exists;

            if(store) {
                exists = true
            }
            else{
                exists = false
            }
            res.status(200).send(exists)
        } catch (error) {
            res.status(500).send(error)
            
        }
})
router.post('/seller/subscribe', auth, async (req: Request, res: Response) => {
    const {plan, type} = req.body;
    const customer = req.user.customer_id;
    try {
        if (plan !== 'free'){
            const session = await createCheckoutSession(customer, process.env.PREMIUMMONTHLY as string, type);
            req.user.plan = 'Premium';
            req.user.payId = session?.id as string
            await req.user.save();
            return  res.status(200).send(session);
        }
        req.user.plan = 'free';
        req.user.role = 'seller';
        const seller : Iseller | null = await Seller.findOne({owner: req.user._id});
        if (!seller) return res.status(400).send()
        seller!.isVerified = true
        seller.package = 'free'
        await  seller.save()
        welcomeSellers(req.user.phone, req.user.email, type)
        await req.user.save();
        res.status(200).send({type:'free'})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/seller/verify', auth, async (req: Request, res: Response) => {
    const {type} = req.body;
    try {
        const id = req.user.payId as string
        const sessionDetails: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.retrieve(id);
        if (!sessionDetails) {
            return res.status(404).send()
        }
        if (sessionDetails.payment_status === 'unpaid') {
            return res.status(403).send('You have not paid yet')
        }
        const subscriptionDetails = await stripe.subscriptions.retrieve(<string>sessionDetails!.subscription);
        const endDate = new Date(subscriptionDetails.current_period_end * 1000);
        req.user.endDate = endDate;
        req.user.payId = null;
        req.user.role = 'seller';
        req.user.subId = subscriptionDetails.id;
        req.user.save();
        saveVerifiedSeller(req.user._id, endDate, subscriptionDetails.id, req.user.plan)
        welcomeSellers(req.user.phone, req.user.email, type)
        res.status(200).send(subscriptionDetails)
    } catch (e) {
        res.status(403).send(e)
    }
})
router.delete('/seller/cancel', activeSeller, async (req: Request, res: Response) => {
    try {
        const subscription = await stripe.subscriptions.del(req.seller.subId);
        req.seller.package  = 'free';
        await req.seller.save()
        res.status(200).send(subscription)
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/seller/orders/delivered', activeSeller,async (req:Request, res: Response) => {
    
    try {   
            const store : IStore | null = await Store.findOne({owner: req.seller.id});
            const orders = await Order.find({sellerId: store!._id, status: 'delivered'});
            const length = orders.length;
            if(length > 0){
                return res.status(200).send({show: true})
            }
            res.status(200).send({show: false})
    }
    catch (e){  
            res.status(500).send(e)
    }
})
router.get('/seller/activity', activeSeller, async (req : Request, res : Response) => {
    try {
        const store : IStore | null = await Store.findOne({owner: req.seller._id});
        const activity : IActivity[] = await Activity.find({sellerId: store!._id}).populate({
            path: 'productId',
            model : Product
        }).sort({'createdAt' : 'asc'});
        const totalBill = activity.reduce((a, b) => a + b.bill , 0);
        res.status(200).send({activity, totalBill})
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.get('/seller/loginlink', activeSeller, async (req : Request, res : Response) => {
    try {       
        const link : Stripe.Response<Stripe.LoginLink> = await stripe.accounts.createLoginLink(req.seller.accId as string);
        res.status(200).send(link)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.get('/seller/onboard', sellerAuth, async (req: Request, res: Response) => {
    try {
        if (!req.seller.subId) return res.status(401).send();
        const countryLocation = CountryCodes.find(x => x.country === req.seller?.location)
        const country = countryLocation?.code;
        const account = await stripe.accounts.create({
            country: country === 'UK' ? 'GB' : country,
            type: 'express',
            capabilities: {card_payments: {requested: true}, transfers: {requested: true}},
            business_type: 'individual',
            business_profile: {
                product_description: 'A new Seller'
            }
        })
        req.seller.accId = account.id;
        req.seller.save()
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${baseUrl}/seller/expenses`,
            return_url: `${baseUrl}/seller`,
            type: 'account_onboarding'
        })
        res.status(200).send({url: accountLink.url})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.delete('/seller/remove/onboarding', sellerAuth,async (req:Request, res: Response) => {
        const accId = req.seller.accId  as string;
        try {
             await stripe.accounts.del(accId);
             req.seller.accId = null;
             await req.seller.save()
            res.status(200).send()
        } catch (error) {
            res.status(500).send(error)
        }
})
router.get('/seller/orders/weeklystats', sellerAuth, async (req: Request, res: Response) => {
    const getYesterday = getLastweek(0);
    const get2days = getLastweek(1);
    const get3Days = getLastweek(2);
    const get4Days = getLastweek(3);
    const get5Days = getLastweek(4);
    const get6Days = getLastweek(5);
    const getLastWeek = getLastweek(6);
    try {
        const store : IStore | null = await  Store.findOne({owner : req.seller._id});
        const sellerId = store!._id;
        const now: number = Date.now();
        const orderYesterday: IOrder [] = await getOrdersRangeForSeller(getYesterday, now, sellerId)
        const orderLast2Days: IOrder [] = await getOrdersRangeForSeller(get2days, getYesterday, sellerId);
        const orderLast3Days: IOrder [] = await getOrdersRangeForSeller(get3Days, get2days, sellerId);
        const orderLast4Days: IOrder [] = await getOrdersRangeForSeller(get4Days, get3Days, sellerId);
        const orderLast5Days: IOrder [] = await getOrdersRangeForSeller(get5Days, get4Days, sellerId);
        const orderLast6Days: IOrder [] = await getOrdersRangeForSeller(get6Days, get5Days, sellerId);
        const orderLast7Days: IOrder [] = await getOrdersRangeForSeller(getLastWeek, get6Days, sellerId);
        const day1: number = getTotalSales(orderYesterday);
        const day2: number = getTotalSales(orderLast2Days);
        const day3: number = getTotalSales(orderLast3Days);
        const day4: number = getTotalSales(orderLast4Days);
        const day5: number = getTotalSales(orderLast5Days);
        const day6: number = getTotalSales(orderLast6Days);
        const day7: number = getTotalSales(orderLast7Days);
        res.status(200).send({day1, day2, day3, day4, day5, day6, day7})
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/store/reviews', sellerAuth, async (req: Request, res: Response) => {
    try {
        const store = await Store.findOne({owner: req.seller._id});
        const reviews = await Review.find({owner: store!._id}).sort('desc');
        res.status(200).send(reviews);
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/store/products', sellerAuth, async (req: Request, res: Response) => {
    try {
        const store: IStore | null = await Store.findOne({owner: req.seller._id});
        if (!store) {
            return res.status(400).send('Store does not exist')
        }
        const products = await Product.find({owner: store!._id}).populate({
            path: 'category',
            model: Category,
        }).populate('ratingId').sort({'orders': -1});
        res.status(200).send(products)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.patch('/seller/product/active/:id', sellerAuth, async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const product: IProduct | null = await Product.findById(id);
        product!.active = !product!.active;
        await product!.save();
        res.status(200).send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})
// router.delete('/seller/delete/inactiveOrder', async (req : Request, res : Response) => {
//             try {
//                 const orders : IOrder[]= await Order.find({});
//                 let orderLength : number = orders.length;
//                 for (orderLength; orderLength--;){
//                     const {productId} = orders[orderLength];
//                     const product : IProduct | null = await Product.findById(productId);
//                     if(!product) {
//                       console.log('hello')
//                     }
//                 }
//                 res.status(200).send()
//             }
//             catch (e) {
//                 res.status(500).send(e)
//             }
// })
router.post('/seller/products', sellerAuth, async (req: Request, res: Response) => {
    const ids : string[]  = req.body.ids;

    const newIds  : ObjectId [] = [];
    ids.forEach((id: string) => {
        const newId = new mongoose.Types.ObjectId(id)
        newIds.push(newId)
    })
    try {
        // const store = await Store.findOne({owner: req.seller._id});
        let idLength : number = newIds.length;
        for (idLength; idLength--;){
            const id = newIds[idLength];
            const order: IOrder | null = await Order.findOne({productId : id});
            if (order) return res.status(500).send({message: 'cant delete a product that has an order'})
            await Product.findByIdAndDelete(id)
        }
        res.status(200).send('ok')
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})
router.post('/seller/ads', sellerAuth, async (req : Request, res : Response) => {
    const plan = req.seller.package;
    const limit = adsLimit.find(ad => ad.plan === plan.toLowerCase());
    if (!limit){
        return res.status(404).send('Not found')
    }
    try {
        const store : IStore | null = await Store.findOne({owner: req.seller._id});
        const ads : Iads []  = await Ads.find({owner: store!._id});
        if (ads.length >= limit.limit) return  res.status(400).send('Sorry you have hit the limit, pls upgrade');
        if (!store) return res.status(404).send('Not Found');
        const ad =  new Ads({...req.body, owner : store!._id});
        await ad.save();
            res.status(200).send(ad)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.get('/seller/ads', sellerAuth, async (req : Request, res : Response) => {
        try {
            const store : IStore | null = await Store.findOne({owner : req.seller._id});
            if (!store){
                return res.status(404).send('Not found');
            }
            const products = await Product.find({owner: store!._id}).populate('ratingId');
            const ads = await Ads.find({owner: store!._id}).populate({
                model : Product,
                path : 'productId'
            });
            res.status(200).send({products, ads})
        }
        catch (e) {
            res.status(400).send(e)
        }
})
router.get('/seller/topProducts', sellerAuth, async (req : Request, res : Response) => {
        try {
            const store : IStore | null = await Store.findOne({owner: req.seller._id});
            if(!store) return res.status(404).send('Store does not exists')
            const products : IProduct [] = await Product.find({owner: store._id}).limit(5).sort({'view' : -1}).populate({
                path: 'category',
                model : Category
            }).exec();
            res.status(200).send(products)
        }
        catch (e) {
            res.status(400).send(e)
        }
})
router.get('/seller/recentorders', sellerAuth, async (req: Request, res : Response) => {
        try{
            const store : IStore | null = await Store.findOne({owner: req.seller._id})
            const orders : IOrder[] = await Order.find({sellerId: store!._id}).populate({
                model: Product,
                path: 'productId'
            }).sort({'createdAt' : -1, 'orders' : -1}).limit(5);
            res.status(200).send(orders)
        }
        catch (e) {
            res.status(500).send(e)
        }
})
router.post('/seller/create-customer-billing-session', auth, async (req : Request, res : Response) => {
                const customer = req.user.customer_id
    try {
                    // await createPortal(req.user.firstName)
                const session = await stripe.billingPortal.sessions.create({
                    customer,
                    return_url: `${baseUrl}/seller/business`
                })
                res.status(200).send(session)
        }
        catch (e) {
                    console.log(e)
            res.status(400).send(e)
        }
})
router.get('/seller/isComplete', sellerAuth, async (req : Request, res: Response) => {
    try {
        const isTrue = req.seller.isVerified;
        const store = await Store.findOne({owner : req.seller._id});
        if (isTrue && !store){
            return res.status(200).send({data: 'incomplete'});
        }
        if(isTrue && store) {
            return  res.status(200).send({data: 'seller', storeId: store._id})
        }
        res.status(200).send({data : 'invalid'});
    }
    catch (e) {
        res.status(500).send(e)
    }
})

export default router;