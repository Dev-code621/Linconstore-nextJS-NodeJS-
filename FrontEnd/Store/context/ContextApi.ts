import React from "react";

const ContextApi = React.createContext({
    isUserLoggedIn: () : boolean => false,
    config:  {},
    adminConfig: {},
    handleRole: (role : string) : void => {},
    role: '',
    handleName: (name : string) : void => {},
    name: '',
    rate: 0,
    handleRateChange: () : void => {},
    isLoggedIn: false,
    onAdminLogin: () => {},
    isAdminLoggedIn: false,
    handleLogout: () : void => {},
    clearRatingId: () : void => {},
    handleRatingId: (rating: string) : void => {},
    ratingId: '',
    adminRate: 0,
    handleAdminRate: (rate: number) => {},
    handleCartChange: () : void => {},
    handleIsSeller: () : void => {},
    handleIsNotSeller: () : void => {},
    isSeller: false,
    cartChange: false,
    sellerId: '',
    sellerIsActive: false,
    handleSellerActive: (active: boolean) => {},
    handleUpdateSellerId: (sellerId: string) => {},
    isUpdating: false,
    handleUpdateCart: () : void => {},
    handleRefetch: () : void => {},
    storeScrollPos: 0,
    handleStorePos: (pos : number) : void => {}
})

export default ContextApi;