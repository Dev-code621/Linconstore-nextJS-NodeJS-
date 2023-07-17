import express, {Request, Response, Router} from "express";
import Product, {IProduct} from "../Models/Product";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import Store, {IStore} from "../Models/Store";
import {sellerAuth} from "../Middleware/auth";
import Seller from "../Models/Seller";
import Review from "../Models/Review";
import Ads, {Iads} from "../Models/Ads";
import Rating from "../Models/Rating";

const router  : Router =  express.Router()
router.get('/product/:id', async (req: Request, res : Response) => {
    const id = req.params;
    try {
        const product = await Product.findById( new ObjectId(id as unknown as mongoose.Types.ObjectId)).populate({
            path: 'owner',
            model : Store
        });
        if (!product){
            return res.status(404).send()
        }
        res.status(200).send(product)
    }
    catch (e) {
        console.log(e)
        res.status(401).send(e)
    }
})
router.get('/store/product', async (req: Request, res : Response) => {
        const {name} = req.query;
    try {
        const store = await Store.findOne({name});
        if(!store){
          return res.status(402).send('Not found')
        }
        const products = await Product.find({owner : store!.owner, active: true})
        res.status(200).send(products)
    }
    catch (e) {
        res.status(402).send(e)
    }
})

router.patch('/product/:id', sellerAuth, async(req : Request,  res : Response) => {
    const updates : string[] = Object.keys(req.body);
    const existingUpdate : string [] = ['tags', 'photo', 'title', 'description', 'category', 'subcategory', 'instruction',
    'global', 'shipping', 'variants','weight', 'quantity', 'care', 'shippingDetails', 'price'
    ];
    // const isPhoto : boolean =  updates.includes('photo');
    const isAllowed : boolean = updates.every(update => existingUpdate.includes(update));
    if (!isAllowed){
        return res.status(401).send('Invalid Updates');
    }
        const _id : string = req.params.id;
    try {
        const store : IStore  | null = await Store.findOne({owner : req.seller._id});
        if(!store) return res.status(404).send('Store does not exist')
        const product : IProduct | null = await Product.findOne({owner: store._id, _id});
        if (!product) {
            return res.status(401).send('Product does not exist');
        }
        const isPrice = updates.includes('price');
        const price : number = req.body.price;
        if(isPrice && price < product.price){
            const oldPrice : number = product.price;
            const priceDiff : number = oldPrice - price;
            product.discount = Number(((priceDiff / oldPrice) * 100).toFixed(0));
            const date = new Date()
            product.hot = true;
            product.productUpdatedDate = date;
        }
        // const uploader  = async (path : string) => await cloudinary.v2.uploader.upload(path)
        // const index1 = updates.indexOf('photo')
        // if (isPhoto) {
        //     const photo : string[] = [];
        //     const images: string [] = req.body.photo
        //     for (const image of images) {
        //         const response : cloudinary.UploadApiResponse = await uploader(image)
        //         photo.push(response.secure_url)
        //     }
        //     updates.forEach((update, index) => index !== index1 ? (product as any)[update] : product!.photo = index !== index1 ? req.body[update] : photo);
        //     await product!.save()
        //     return     res.status(200).send(product)
        // }
        updates.forEach(update => (product as any)[update] = req.body[update]);
        await product.save()
        res.status(200).send(product)
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/hotdeals', async (req : Request, res : Response) => {
    try{
            const hotdeals : IProduct[] = await Product.find({hot: true, active: true}).populate({
                path: 'owner',
                model : Store,
                populate: {
                    path: 'owner',
                    model: Seller
                }
            }).populate('ratingId').sort({createdAt: 'desc'})
            res.status(200).send(hotdeals)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/search/product', async (req : Request, res : Response) => {
    const term  = req.query.term;
    const id = req.query.id;
    try {
        const ads : Iads [] =  await Ads.find({title: {$regex : term, $options: 'i'}, active: true}).populate({
            path: 'productId',
            model: Product,
            populate: [
                            {
                         path: 'ratingId',
                         model: Rating,
                            },
                            {
                         path: 'owner',
                         model: Store,
                         populate : {
                             path: 'owner',
                            model: Seller
                         },
                        }
                        ]
        }).limit(5);
        if (id){
            const products  : IProduct [] = await Product.find({active: true, title: {$regex : term, $options: 'i'}, category: new ObjectId(id as any)}).populate('ratingId').populate({
                path: 'owner',
                model: Store,
                populate: {
                    path: 'owner',
                    model: Seller
                }
            });
            const relatedProduct : IProduct [] = await Product.find({active : true, category: new ObjectId(id as any)});
            const relatedItem = [];
            for (const related of relatedProduct){
                const {tags}  = related;
                if (tags?.includes(term as string)){
                    relatedItem.push(related)
                }
            }
            return  res.status(200).send({products, relatedItem, ads})
        }
        const products  : IProduct [] = await Product.find({title: {$regex : term, $options: 'i'}, active : true}).populate('ratingId').populate({
            path: 'owner',
            model: Store,
            populate: {
                path: 'owner',
                model: Seller
            }
        });
        const relatedProduct : IProduct [] = await Product.find({active : true});
        const relatedItem = [];
        for (const related of relatedProduct){
         const {tags}  = related;
            if (tags?.includes(term as string)){
                relatedItem.push(related)
            }
        }
        res.status(200).send({products, relatedItem, ads})
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.get('/product', async (req : Request, res : Response) => {
    const query = req.query;
    const sort : boolean = query as unknown as string === 'new';
    try {
        const product : IProduct [] = await Product.find({active: true}).sort('desc').limit(sort ? 8 : 100);
        res.status(200).send(product);
    }
    catch (e) {
        res.status(401).send(e)
    }
})
router.get('/brands/products', async (req : Request, res : Response) => {
    try {
        const products = await Product.find({active: true}).populate({
       path: 'owner',
            model: Store,
            match : {
                account: 'business'
            }
        }).exec();
        res.status(200).send(products)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/topProducts', async  (req : Request, res : Response) => {
        try {
            const products : IProduct[] = await Product.find({active: true}).sort({'orders' : -1}).populate({
                path: 'owner',
                model: Store,
                populate: {
                    path: 'owner',
                    model: Seller
                }
            }).populate('ratingId').sort({createdAt: 'desc'}).limit(12);
            res.status(200).send(products)
        }
        catch (e) {
            res.status(500).send(e)
        }
})
router.get('/products', async (req : Request, res : Response) => {
    try {
        const productsFind : IProduct[] = await Product.find({active: true}).where('quantity').gt(0).populate({
            path: 'owner',
            model: Store,
            populate:{
                path: 'owner',
                model : Seller
            }
        }).populate('ratingId').sort({createdAt: 'desc'}).limit(12);
        // let products : IProduct[] = [];
        // let i = productsFind.length
        // for (i; i--;){
        //     if (productsFind[i].ratingId){
        //         const product : IProduct  =  await productsFind[i].populate('ratingId');
        //         products.push(product)
        //     }else {
        //         products.push(productsFind[i])
        //     }
        // }
        res.status(200).send(productsFind)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/product/reviews/:id', async (req: Request, res: Response) => {
    const id = (req.params);
    try {
        const review = await  Review.find({productId: new ObjectId(id as unknown as mongoose.Types.ObjectId)});
        res.status(200).send(review)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
export default router;
