
    export  type addAddressDefaultValue = {
    firstName: string,
        lastName: string,
        country: string,
        address: string,
        phoneInput: string
    }
    export interface IProducts {
        title: string,
        price: number,
        subcategory: string,
        shippingDetail: string,
        photo:string,
        shipping: any[],
        instruction: string,
        variants: any[],
        _id: string,
        quantity: number
    }

    export  type addAddress = {
        firstName: string,
        lastName: string,
        country: string,
        address: string,
        phoneNumber: string
    }
    type stock = {
        name : number,
        price : number,
    }
   export type hey = {
        stock : stock [],
    }
    export type EditItemDefaultValue ={
        title: string,
        description: string,
        price: number,
        quantity: number,
        category: string,
        subCategory: string,
        details: string,
        variation: string,
        tags: string,
        test: hey[],
        terms: boolean,
        standard: number,
        express: number,
        file: FileList [],
        // policy: string,
        care: string,
        africa: number,
        europe: number,
        northAmerica: number,
        southAmerica: number,
        oceania: number,
        antarctica: number,
        asia: number
    }
export type postItemDefaultValue ={
    title: string,
    condition: string,
    description: string,
    price: number,
    quantity: number,
    category: string,
    subCategory: string,
    details: string,
    variation: string,
    tags: string,
    test: hey[],
    terms: boolean,
    standard: number,
    express: number,
    file: FileList [],
    // policy: string,
    care: string,
    africa: number,
    europe: number,
    northAmerica: number,
    southAmerica: number,
    oceania: number,
    antarctica: number,
    asia: number

}
export type createUserDefaultValue  = {
    firstName: string,
    lastName: string,
    email : string,
    // phone: string,
    password: string,
    terms: boolean
}

export type createUserDefaultValueMongodb  = {
    username: string,
    email : string,
    date: string,
    role: string
}
export type loginUserDefaultValue = {
    email : string,
    password: string,
}
export type contactUsDefaultValue = {
        email : string,
        name: string,
        phone: string,
        message: string
}
export type closeAccountDefaultValue = {
        reason : string,
        comment: string,
    }
    export interface IUser {
    firstName: string,
        lastName: string
    }
export type viewUsersDefaultValue = {
         _id: string,
         username: string,
         role: string,
         email: string,
         date: string
}
type Rating = {
    name: string,
    rating: number
}

export type TProducts = {
        title: string,
        price: number,
        photo: string[],
        owner: TStoreId,
        ratingId : TRating,
        discount: number,
        _id: string
}
export interface IOrders {
    shippingProvider: string,
    trackingId: string,
    refund: boolean,
    productId: TProducts
}

export type TProductCart  ={
    productId : string,
    name: string,
    quantity: number,
    price : number,
    photo: string
}
export type TCart = {
        bill : number,
        products : TProductCart []
}
export type TCat = {
    title: string
}
export type IAdminProducts = {
    title: string,
    category: TCat,
    _id: string,
    price: number,
    active: boolean,
}
type IStoreOwner = {
    package : string
}
export type TAdminSeller = {
    name: string,
    listing: number,
    owner: IStoreOwner,
    isVerified : boolean,
    expenses : number,
    balance: number,
    _id: string,
    currency: string
}
export type ISellerRequestMes = {
    message:string
}

export type TAdminUser = {
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    orders: number,
    _id: string,
    isClosed: boolean,
    isVerified : boolean
}
export type Tseller  ={
    location: string,
    accId: string | null
}
export type TStoreId  = {
    name: string,
    _id: string,
    logo: string,
    sales: number,
    owner: Tseller,
    location: string,
    currency: string,
    disabled: boolean
}
export type TStoreId1  = {
    name: string,
    _id: string,
    logo: string,
    balance: number,
    owner: Tseller,
    location: string,
    currency: string,
    disabled: boolean
}
export type TRefunds = {
    _id: string,
    storeId : TStoreId,
    userId: createUserDefaultValue,
    status : string
}
export type TSellerStore = {
    _id: string,
    name: string,
    isActive: boolean,
    owner: createUserDefaultValue,
    documentType: string,
    storeId: TStoreId1,
    file: string,
    isVerified: boolean
}
    export type TSellerStore1 = {
        _id: string,
        name: string,
        logo : string
    }
export type IYearlyStats  = {
    dec : number,
    nov: number,
    oct: number,
    sept: number,
    aug: number,
    july: number,
    jun: number,
    may: number,
    april: number,
    march: number,
    feb: number,
    jan: number
}
export type IRound  = {
    dec: number,
    number: number
}
export interface IVariants {
    option : string,
    variant : string
}
type TRatings = {
    rating : number,
    userId: string
}
export type TRating = {
    averageRating : number,
    ratings: TRatings[]
}