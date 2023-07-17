import User, {Iuser} from "../Models/User";
import mongoose from "mongoose";
import {generateOtp} from "./generateOtp";
import {
    orderDeliveredSuccessfully,
    OrderPlacedNotification,
    sellerOrderReceived,
    updateOrderShippedNotification,
    verifyEmail
} from "./verifyUser";
import Order, {IOrder} from "../Models/Order";
import {getLastweek, getTimeDiff} from "./TimeDiff";
import {stripe} from "../app";
import Cart, {ICart, TProduct, TVariant} from "../Models/Cart";
import Product, {IProduct} from "../Models/Product";
import Seller, {Iseller} from "../Models/Seller";
import Admin, {IAdmin} from "../Models/Admin";
import baseUrl from "../baseurl/baseUrl";
import Store, {IStore} from "../Models/Store";
import Refund, {IRefund} from "../Models/Refund";
import Activity, {IActivity} from "../Models/Activity";
import Wish from "../Models/Wish";
import Stripe from "stripe";
import Shipping, {IShipping} from "../Models/Shipping";
import {ObjectId} from "mongodb";
import cron from 'node-cron'
import Rating, {IRating} from "../Models/Rating";
import Review, {IReview} from "../Models/Review";
import rating from "../Models/Rating";

export const findIfEmailExist  = async (email : string)  => {
    const user = await User.findOne({email});
    if (!user){
        throw  new Error('User does not exist')
    }
    return  user
}

export const validateUser =  async  (otp: number, id : mongoose.Types.ObjectId) =>{
            const user = await User.findById(id);
            if (!user){
               throw new Error('User does not exist')
            }
            if (user && user.otp !== otp){
                throw new Error('Invalid otp')
            }
           return User.findByIdAndUpdate(id, {isVerified: true});
}
export const findIfAdminExist = async (email : string) => {
    const admin = await Admin.findOne({email});
    if (!admin) throw new Error('Admin does not exist')
    return admin;
}
export const validateAdmin = async (otp: number, id: mongoose.Types.ObjectId) => {
    const admin : IAdmin | null = await Admin.findById(id);
    if (!admin) throw  new Error('Admin does not exist');
    if (admin && admin.otp !== otp) throw  new Error('Invalid OTP');
    return admin;
}

export const findIfEmailExistAndIsVerified = async (email: string) => {
    const user = await User.findOne({email});
    if (!user){
        throw new Error('User does not exist')
    }
    if (user.isVerified === true){
         throw new Error('User already verified')
    }
    const otp = generateOtp();
    try {
        await verifyEmail(user.phone, user.email, otp);
     await  User.findByIdAndUpdate(user._id, {otp});
    }
    catch (e) {
        console.log(e)
    }
    return otp;
}


export const updateOrders = async () => {
    const orders : IOrder [] = await Order.find({});
    let len : number = orders.length;
    for (len; len--;){
        const date = getTimeDiff(orders[len].createdAt);
        if (date > 12){
             orders[len].active = true;
             await orders[len].save();
        }
    }
}
export const updateShipping = async () => {
    const orders : IOrder[] = await Order.find({status: 'processed'});
    let orderLength : number = orders.length;
    for (orderLength; orderLength--;){
        const {updateShipping, shipping, updated} = orders[orderLength];
        const timeDiff = getTimeDiff(updateShipping);
        if (timeDiff > 120  && shipping === 'Express' && updated){
            orders[orderLength].status = 'shipped';
            await orders[orderLength].save()
        }
        if (timeDiff > 288 && shipping === 'Standard' && updated){
            orders[orderLength].status = 'shipped';
            await orders[orderLength].save()
        }
    }
}
export const updateHotdeals = async() => {
    try{
        const products : IProduct[] = await Product.find({hot: true});
        let productLength : number = products.length;
         for(productLength; productLength--;){
                const {productUpdatedDate} = products[productLength];
                    if(getTimeDiff(productUpdatedDate) > 720){
                        products[productLength].hot = false;
                        products[productLength].save() 
                    }
         }
    }
    catch(e){
        console.log(e)
    }
    
}
export const updateActivity =  async () => {
        const orders : IOrder [] = await Order.find({status: 'shipped'});
        let length : number = orders.length;
        for(length; length--;){
            const date : number = getTimeDiff(orders[length].createdAt);
            const {productId, sellerId, shippingCost, amount} = orders[length]
            const store = await Store.findOne({owner: sellerId});
            const seller = await Seller.findById(store?.owner)
            const feeRate : number = seller?.package === 'free' ? 10 : 5
            if (date > 216 && !orders[length].activity){
                orders[length].activity = true;
                const bill : number = ((shippingCost + amount) - ((feeRate/100) * amount))
                const activity = new Activity({
                    sellerId,
                    productId,
                    bill
                });
                await activity.save();
                orders[length].save();
                const store : IStore | null = await Store.findOne({owner: sellerId});
                if (!store) return
                store!.balance = store!.balance + bill;
               await store.save()
            }
        }
}
export const createCheckoutSession =  async (customer : string , price : string, type: string) => {
    const success_url = type ? `${baseUrl}/seller/renewal/success` : `${baseUrl}/seller/payment/success`;
    const cancel_url = type ? `${baseUrl}/seller/renewal/cancel` : `${baseUrl}/seller/payment/cancel`
    try {
    const session = await stripe.checkout.sessions.create({
        customer,
        mode: 'subscription',
        // payment_method_types: ['card'],
        line_items: [{
            price,
            quantity: 1
        }],
        success_url,
        cancel_url
    })
        return session;
    }
    catch (e) {
        console.log(e)
    }
}
export const createPaymentCheckout =  async (customer : string , priceData : any) => {
    try {
        const session = await stripe.checkout.sessions.create({
            customer,
            mode: 'payment',
            line_items: priceData,
            success_url : `${baseUrl}/account/rate`,
            cancel_url: `${baseUrl}/seller/payment/cancel`
        })
        return session;
    }
    catch (e) {
        console.log(e)
    }
}

export const  generateRandomX = (length : number) : string => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const checkSubscription = (endDate: Date): boolean => {
    const currentDate = new Date();
    const twoDaysAfterEnd = new Date(endDate);
    twoDaysAfterEnd.setDate(twoDaysAfterEnd.getDate() + 2);

    if (currentDate > twoDaysAfterEnd) {
        return  true
    } else {
        return false
    }
};

// Usage example
const subscriptionEndDate = new Date('2023-07-10'); // Replace with the actual subscription end date
checkSubscription(subscriptionEndDate);

const calculateTotal = (products: TProduct[]) =>  products.reduce((a, b) => a + b.quantity, 0)

const orderPlacedNotification = async (email:string, products: TProduct[], address: string, totalAmount:number, shipping: string, shippingPrice: number[] ) => {
        let newShippingPrice  : number = shippingPrice.reduce((a, b) => a + b, 0)
        const product = products.map(x => {
            const photo =  x.photo;
            return `
            <tr>
                <td align="center" width="30%">
            <img src=${photo} alt="Product Image" style="display: block; width: 100%; height: auto; border-radius: 10px;">
                </td>
                <td align="left" style="padding: 10px;">
            <sub style="font-size: 10px; text-align: left;"> Product ID: ${x.productId}</sub>
            <p style="font-size: 14px; margin: 0;">${x.name}</p>
            
            ${x.variants.length > 0 ? x.variants.map(y => {
                return `
                            <span style="font-size: 12px; margin: 0;">${y.variant} - ${y.option}</span>
                `
            }).join('/') : ''}
            <p style="font-size: 12px; margin: 0;">Unit - ${x.quantity}</p>
                <p style="font-size: 12px; margin: 0;">$ ${x.price}</p>
            </td>   
            </tr>
            `
        })
     await OrderPlacedNotification(totalAmount,email,product,shipping, newShippingPrice, address)
}


const findSellerEmail = async (owner: mongoose.Types.ObjectId) => {
    try {
        const seller = await Seller.findById(owner);
        const sellerId = seller!._id;
        const user  = await User.findOne({sellerId})
        return user!.email
    }
    catch (e) {
        console.log(e)
    }

}
export const extractDataForOrdersUpdate =  async (order: IOrder) => {
    try {
            const {userId, shippingProvider, shippingCost, shipping,productId,trackingId, variants, address, createdAt} = order

            const user : Iuser | null = await User.findById(userId);
            const email = user?.email
            const product : IProduct | null = await  Product.findById(productId);

            if (!product) return
            await updateOrderShippedNotification(trackingId,shippingProvider,address,email,product,variants,shipping,shippingCost,createdAt)
    }
    catch (e) {
        console.log(e)
    }
}
export const sendOrderDeliveryNotification = async () => {
    try {
        const orders: IOrder[] = await Order.find({status: 'shipped'});
        let orderLength = orders.length

        for (orderLength; orderLength--;) {
            const {
                shippingProvider,
                shippingCost,
                productId,
                userId,
                shipping,
                trackingId,
                variants,
                address,
                createdAt
            } = orders[orderLength];
            const product = await Product.findById(productId) as IProduct;
            if (!product) continue
            const user = await User.findById(userId)
            orders[orderLength].status = 'delivered';
            await orders[orderLength].save()
            const email = user?.email;
            await orderDeliveredSuccessfully(trackingId, shippingProvider, address, email, product, variants, shipping, shippingCost, createdAt)
        }
    }
    catch (e) {
        console.log(e)
    }
}
export const disableUnsoldProductsForFreePlanSellers = async () => {
    const productCreatedAt = getLastweek(60);
    try {
                    const sellers : Iseller[] = await Seller.find({package: 'free'});

                    let length : number = sellers.length;

                    for(length; length--;){
                        const {_id } = sellers[length];
                        const store : IStore | null = await Store.findOne({owner: _id});
                        if(!store) continue
                        if(store){
                            const products : IProduct[] = await Product.find({orders: 0, owner: store._id});
                            let productLength : number = products.length;
                            for(productLength; productLength--;){
                                const {createdAt}  = products[productLength];
                                if(createdAt > productCreatedAt){
                                    products[productLength].active = false
                                    await products[productLength].save()
                                }
                            }

                        }
                    }

                } catch (error) {
                    
                }
}


export const addToOrders = async (cart : ICart | null, email:string, userId: mongoose.Types.ObjectId, address : string, shipping: string) => {
    if (!cart) return
    const products : TProduct  [] =  cart!.products;
    const {bill} = cart;
    let productsLength = products.length;
    const shippingPrice : number[] = []
    try {
        for (productsLength; productsLength--;){
            const product : IProduct | null = await Product.findById(products[productsLength].productId);
            if (!product) {
                throw new Error('Product not found')
            }
            const {productId, name, quantity, price,variants} = products[productsLength];
            let variantLength = variants.length;
            if(variantLength > 0){
                for(variantLength; variantLength--;){
                    const {variant, option}   = variants[variantLength];
                    // console.log(variant, option)
                    //@ts-ignore
                    const updateProduct : any | null= product?.variants.find(x => x.variant === variant && x.option === option);
                    //@ts-ignore
                    const updateProduct2 : any[]=  product?.variants.filter(x => x.variant !== variant && x.option !== option);
                    product?.variants.forEach(x => {
                        if (x.variant === variant && x.option === option){
                            if (x.stock === 0) return
                            x.stock = x.stock - quantity
                        }
                    })
                    // if (!updateProduct) return
                    //@ts-ignore
                    // console.log('update product', updateProduct)
                    // if (updateProduct.stock === 0) return
                    // updateProduct.stock =  updateProduct.stock - quantity;
                    // console.log(updateProduct.stock, quantity)
                    // console.log(updateProduct2)
                    // updateProduct2.push(updateProduct)
                    // product!.variants = updateProduct2;
                   await product?.save()
                }
            }
            const {shipping : existingShipping , owner} = product!;
            const shippingNewPrice : number = shipping === 'Standard' ? existingShipping[0].standard.price : existingShipping[0].express.price;
            shippingPrice.push(shippingNewPrice)
            const newShipping = new Shipping({
                price : shippingNewPrice,
                storeId : owner
            });
            await newShipping.save();
            if (product?.quantity <= 0){
                throw new Error('Product is out of stock')
            }
            product!.quantity = product!.quantity - quantity;
            product!.orders = product!.orders + 1;
            await product?.save()
            const store : IStore | null = await Store.findById(owner)
            const sellerId  = store!.owner;
            const email : string | undefined = await findSellerEmail(sellerId)
            // @ts-ignore
            store?.sales = store?.sales + 1;
            await store?.save()
            const order = new Order({
                sellerId : owner as mongoose.Types.ObjectId,
                userId,
                productId,
                name,
                shippingCost: shippingNewPrice,
                amount: bill,
                shipping,
                quantity,
                price,
                variants,
                address
            })
            await order.save()
            await sellerOrderReceived( products[productsLength], email,shipping,shippingNewPrice )
        }
        await orderPlacedNotification(email, products,address, bill, shipping, shippingPrice)
    }
    catch (e) {
        console.log(e)
    }
}
export const saveVerifiedSeller = async (user_id : mongoose.Types.ObjectId, endDate: Date, sub_id: string, plan: string) => {
      try {
          const seller : Iseller | null = await Seller.findOne({owner: user_id});
          if (!seller){
              return
          }
          seller.endDate =  endDate;
          seller.isVerified = true;
          seller.subId = sub_id;
          seller.package = plan
          await seller.save()
      }
      catch (e) {
          console.log(e)
      }

}
export const getBiggestNumber = (first : number, second : number, order: boolean) : number => {
    if (order) return first > second ?  first :  second
    else return  first > second ? second : first
}

export const replaceNull = (value : number) : number => value ? value : 0;

export const getTotalSales = (orders: IOrder[]) => orders.reduce((partial,a) => partial + a.price * a.quantity, 0);
export const getTotalShippingPrice = (order: IOrder[]) => order.reduce((a, b) => a + b.shippingCost, 0);
export const getOrdersRange = async (firstDate : Date, secondDate : number | Date) : Promise<IOrder []> => {
    const orders = await Order.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate
        }
    });
    return  orders;
}
export const getOrdersRangeForSeller = async (firstDate : Date, secondDate : number | Date, sellerId: mongoose.Types.ObjectId) : Promise<IOrder []> => {
    const orders = await Order.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate
        },
        sellerId
    }).or([{status: 'shipped'}, {status: 'delivered'}, {status: 'processed'}]);
    return  orders;
}
export const getSellerRange = async (firstDate : Date, secondDate : number | Date) : Promise<Iseller []> => {
    const sellers: Iseller[] = await Seller.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate
        }
    });
    return sellers;
}
    export const getUserRange = async (firstDate : Date, secondDate : number | Date) : Promise<Iuser []> => {
        const users : Iuser[] = await User.find({
            createdAt: {
                $gte: firstDate,
                $lte: secondDate
            }
        });
        return  users;
    }
export const getRefundRange = async ( storeId: mongoose.Types.ObjectId, firstDate : Date, secondDate : number | Date) : Promise<IRefund []> => {
    const refunds : IRefund[] = await Refund.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate
        },
        storeId
    });
    return  refunds;
}
export const getProductRange = async (firstDate : Date, secondDate : number | Date) : Promise<IProduct []> => {
    const products : IProduct[] = await Product.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate
        }
    });
    return  products;
}
const handleSortRep = async (sellerId : mongoose.Types.ObjectId) : Promise<void> => {
    const orders : IOrder [] = await Order.find({sellerId});
    const sold : number = orders.length;
        const store : IStore | null = await Store.findOne({owner: sellerId});
        if (sold>= 20 &&  sold < 100) {
            store!.sold = sold;
            store!.reputation = store!.reputation + 2;
              await store!.save();
            return
        }
        if (sold < 20) return;
        if (sold - store!.sold >= 100) {
            store!.reputation = store!.reputation + 2;
            store!.sold = sold;
              await  store!.save();
        }
        const getLastMonth = getLastweek(28);
        const refunds : IRefund[] = await getRefundRange(store!._id, getLastMonth, Date.now());
        if (store!.lastCheck < 28)  return
        if (refunds.length > 10) {
            store!.lastCheck = 1;
            store!.reputation = store!.reputation - 4;
            await store!.save()
        }
}
const deleteCartProduct = async (productId : mongoose.Types.ObjectId) => {
    const cart : ICart[]  = await Cart.find({'products.productId' : productId})
    let cartLength : number = cart.length;
    for (cartLength; cartLength--;){
        const productIndex : number = cart[cartLength].products.findIndex(product =>  product.productId  === productId);
        if (productIndex > -1){
            let product = cart[cartLength].products[productIndex];
            cart[cartLength].bill -= product.quantity * product.price;
            if (cart[cartLength].bill < 0){
                cart[cartLength].bill = 0
            }
            cart[cartLength].products.splice(productIndex, 1);
            cart[cartLength].bill = cart[cartLength].products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
        await cart[cartLength].save()
        }
}
}
const deleteWish  = async (productId: mongoose.Types.ObjectId) => {
   await Wish.deleteMany({productId})
}

export const updateCart = async () => {
    const products : IProduct[] = await Product.find({quantity: 0});
    let productLength : number = products.length;
    for (productLength; productLength--;){
        await deleteCartProduct(products[productLength]._id)
        await deleteWish(products[productLength]._id)
    }
}

export const handleSetSellerRep = async () => {
        const orders : IOrder[] = await Order.find({});
        let length : number = orders.length;
        for (length; length--;){
            await handleSortRep(orders[length].sellerId)
        }
}
export const days_passed = (dt: Date) : number =>  {
    let current = new Date(dt.getTime());
    let previous = new Date(dt.getFullYear(), 0, 1);

    // @ts-ignore
    return Math.ceil(((current - previous) + 1) / 86400000);
}
type IRound  = {
    dec: number,
    number: number
}
export const round = (N: number) : any => {
    const fixed = N.toFixed(0);
    const length = fixed.toString().length;
    if (length === 1) return N;
    const numerHolder : IRound[] = [
        {
            number: 2,
            dec: 10
        },
        {
            number: 3,
            dec: 100,
        },
        {
            number: 4,
            dec: 1000,
        },
        {
            number: 5,
            dec: 100000
        },
        {
            number:6,
            dec:1000000
        }];
    const round : IRound | undefined = numerHolder.find(num => num.number === length);
    const ceil = Math.ceil(N / round!.dec) * round!.dec;
    let str = ceil.toString().slice(0, -3);
    return parseInt(str);
}
export const createPortal = async (name: string) : Promise<Stripe.Response<Stripe.BillingPortal.Configuration>>    =>  {
    const configuration  : Stripe.Response<Stripe.BillingPortal.Configuration> = await stripe.billingPortal.configurations.create({
        features: {
            subscription_update: {
             default_allowed_updates : [],
                enabled: true,
                products: "",
                proration_behavior: 'none'
            },
            subscription_cancel: {
                cancellation_reason: {
                    enabled: true,
                    options : []
                },
                enabled: true,
                mode : "at_period_end"
            }
        },
        business_profile: {
            headline: `Hi ${name}, Welcome to your portal`,
            privacy_policy_url: `${baseUrl}/policy`,
            terms_of_service_url: `${baseUrl}/terms`
        }
    })
    return  configuration
}


export const updateStoreActivity = async () => {
    const stores : IStore[]  =  await Store.find({});
    let storeLength = stores.length;
    for (storeLength; storeLength--;){
        // @ts-ignore
        const {updatedAt} = stores[storeLength];
        const lastUpdated = getTimeDiff(updatedAt);
        if (lastUpdated > 6){
            stores[storeLength].disabled = false;
            await stores[storeLength].save()
        }
    }
}
export const deleteInvalidStores = async () => {
    const stores : IStore[] = await Store.find({});
    let storeLength : number = stores.length;
    for (storeLength; storeLength--;) {
        const {owner} = stores[storeLength];
        const seller : Iseller | null = await Seller.findById(owner);
        if (!seller){
            stores[storeLength].delete();
        }
    }
}

export  const deleteInvalidProductsRating = async () => {
    const ratings : IRating[] = await Rating.find({});
    let length  : number = ratings.length;
    for (length; length--;){
        const {productId} = ratings[length];
        const product = await Product.findById(productId);
        if (product) continue
        if (!productId) {
            ratings[length].delete()
            continue
        }
        Rating.deleteMany({productId})
    }
}

export const deleteInvalidProductsReviews = async () => {
    const reviews : IReview[] = await Review.find({});
    let length : number =  reviews.length;
    for (length; length--;) {
        const {productId} = reviews[length];
        const product = await Product.findById(productId);
        if (product) continue
        await reviews[length].delete()
        Review.deleteMany({productId});
    }
}

export const deleteInvalidProductOrders = async () => {
    const orders : IOrder[] = await Order.find({});
    let length : number = orders.length;
    for (length; length--;){
        const {productId} =  orders[length];
        const product = await Product.findById(productId);
        if (product) continue;
        await orders[length].delete()
        Order.deleteMany({productId})
    }
}

export const deleteInvalidProductActivity = async () => {
    const activities : IActivity[] = await Activity.find({});
    let length: number = activities.length;
    for (length; length--;){
        const {productId}  = activities[length];
        const product = await Product.findById(productId);
        if (product) continue;
        await activities[length].delete()
    }
}
export const deleteInvalidProductRefund = async () => {
    const refunds : IRefund[] = await Refund.find({});
    let length: number = refunds.length;
    for (length; length--;){
        const {productId}  = refunds[length];
        const product = await Product.findById(productId);
        if (product) continue;
        await refunds[length].delete()
    }
}
export function capitalizeFirstLetter(string : string)  : string{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function unCapitalizeFirstLetter(string : string)  : string{
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export  const updateUserCart  =  async (owner : mongoose.Types.ObjectId , productId : string, sign: boolean) => {
    try {
        const cart : ICart | null = await Cart.findOne({owner});
        const product : IProduct | null = await Product.findOne({_id: new ObjectId(productId)});
         if (!product){
            throw  new Error('Product not found');
        }

        // const price : number = product.price;
        const productQuantity : number = product.quantity;
        if (cart){
            const productIndex : number =  cart.products.findIndex(product => product.productId.toHexString() === productId);
            if (productIndex > -1){
                let product = cart.products[productIndex];
                if (sign && product.quantity    + 1 > productQuantity) {
                   throw new Error('Product quantity exceeded')
                }
                product.quantity = sign ?  product.quantity + 1 : product.quantity - 1;
                cart.bill = cart.products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
                cart.products[productIndex] = product
                await  cart.save();
            }
        }
    }
    catch (e) {
        console.log(e)
            throw  new Error('Something went error' + e)
    }
}


export const deactivateSellerProducts = async(store: IStore) => {
    try {
                const products : IProduct [] = await Product.find({owner: store._id})

                let productLength = products.length;

                for(productLength; productLength--;){
                         products[productLength].active = !products[productLength].active;
                         await products[productLength].save();
                }

    } 
    catch (error) {
        
    }
}

