import express, {Request, Response, Router} from "express";
import Category, {ICategory} from "../Models/Category";
import cloudinary from "cloudinary";
import Product, {IProduct} from "../Models/Product";
import {ObjectId} from "mongodb";
import Store from "../Models/Store";
import Seller from "../Models/Seller";
import {getLastweek} from "../Helpers/TimeDiff";

const router : Router =  express.Router()
cloudinary.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPI,
    api_secret: process.env.CLOUDSECRET
})
router.post('/category', async (req : Request, res : Response) => {

    try {
        // const response  : cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(data.image);
        // const link = response.secure_url;
        const category : ICategory = new Category(req.body);
        await category.save();
        res.status(201).send(category)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.patch('/category/:id', async (req : Request, res: Response) => {
        try {
            const _id = req.params.id;
            const updates : string[] = Object.keys(req.body)
            const allowedUpdates : string[] = ['subcategories', 'title', 'link'];
            const isAllowed : boolean = updates.every(update => allowedUpdates.includes(update))
        if (!isAllowed) return res.status(400).send({message: 'Invalid Update'})
            const category : ICategory | null = await Category.findById(_id);
        if (!category) return  res.status(400).send({message: 'Category does not exist'})

            updates.forEach(update => (category as any)[update] = req.body[update]);
            await category.save()
            res.status(200).send(category)
        }
        catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
})
router.get('/categories', async (req : Request, res : Response) => {
    try {
        const category : ICategory []= await Category.find({});
        res.status(200).send(category)
    }
    catch (e) {
        res.status(500).send(e)
    }
})
router.get('/topcategory', async (req: Request, res : Response) => {
            const lastWeek : Date = getLastweek(7);
            let productPlaceholder : IProduct [] = []
        try{
            const products : IProduct [] = await Product.find({
                createdAt: {
                    $gte: lastWeek,
                    $lte: Date.now()
                },
                orders: {
                    $gt: 1
                }
            }).populate({
                path : 'category',
                model: Category
            }).sort({
                'orders' : -1,
            },).limit(20);
            let productLength = products.length;
            for (productLength; productLength--;){
                if (products[productLength].orders > 0){
                    const isExisting : IProduct | undefined = productPlaceholder.find(x =>  x.category?._id === products[productLength].category?._id)
                    if (isExisting) continue
                    productPlaceholder.push(products[productLength])
                }
            }
            res.status(200).send(productPlaceholder)
            }
        catch (e) {
            console.log(e)
        res.status(500).send(e)
        }
})
router.get('/category/:id', async (req : Request, res : Response ) => {
    const {id} = req.params;
    try {
        const category : ICategory | null = await Category.findById(id);
        const cat_id = new ObjectId(id);
        const products = await Product.find({category:  cat_id, active: true}).populate({
            path: 'owner',
            model: Store,
            populate: {
                path: 'owner',
                model: Seller
            }
        }).populate('ratingId');
        if (!category){
            return res.status(404).send()
        }
        res.status(200).send({category, products})
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/category/:id', async (req : Request, res : Response) => {
            const {id} =   req.params
        try {
            await Category.findByIdAndDelete(id)
            res.status(200).send()
        }
        catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
})
export default router;