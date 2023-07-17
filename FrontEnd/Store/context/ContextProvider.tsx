import ContextApi from "./ContextApi";
import React, {ReactNode, useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteToken} from "../Auth";
import axios from "axios";
import {useGetCart} from "../../hooks/useDataFetch";
import {TCart} from "../../Helpers/Types";
type IAuth = {
    auth : {
        isLoggedIn: boolean,
        token: string,
        adminToken: string
    }
}
interface BaseLayoutProps {
    children?: ReactNode;
}
const key = '5VKy5jyel94La0oJLrXJK2R7IxPI3ekHaIC8pMm4';

const ContextProvider : React.FC<BaseLayoutProps> = ({children}) => {
        const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
        const [rate, setRate] = useState<number>(0)
        const isLoggedIN = useSelector((state : IAuth) => state.auth.token);
        const isAdminLoggedIN = useSelector((state: IAuth) => state.auth.adminToken);
        const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false)
        const [config, setConfig] = useState({});
        const [isSeller, setIsSeller]  = useState<boolean>(false)
        const [adminConfig, setAdminConfig] = useState({});
        const [name, setName] = useState<string>('');
        const [isLogging, setIsLogging] = useState<boolean>(false)
        const [sellerId, setSellerId] = useState<string>('')
        const [role, setRole] = useState<string>('');
        const [storeScrollPos, setStoreScrollPos] = useState<number>(0)
        const [isRefetch, setIsRefetch] = useState<boolean>(false)
        const [sellerIsActive, setSellerIsActive] = useState<boolean>(true);
        const [adminRate, setAdminRate] = useState<number>(0)
        useEffect(() => {
            const isLoggedIn = localStorage.getItem('token');
            if (!!isLoggedIn || isLoggedIN ){
                setIsLoggedIn(true)
                const token = encodeURI(isLoggedIn || isLoggedIN)
                const config = {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
                setConfig(config)
            }
            else {
                setIsLoggedIn(false)
            }
        },[isLoggedIN,isLogging, isRefetch])
    useEffect(() => {
        const isAdminLogin = localStorage.getItem('adminToken');
        if (!!isAdminLogin || isAdminLoggedIN ){
            setIsAdminLoggedIn(true)
            const token = encodeURI(isAdminLogin || isAdminLoggedIN)
            const config = {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }
            setAdminConfig(config)
        }
        else {
            setIsAdminLoggedIn(false)
        }
    },[isAdminLoggedIN,isLogging])
        const isUserLoggedIn = useCallback(() => {
            return isLoggedIn
        },[isLoggedIN]);
        const dispatch = useDispatch();
        const handleIsSeller = () => setIsSeller(true);
       const handleIsNotSeller = () => setIsSeller(false)
    const handleAdminRate = (rate: number) => {

           setAdminRate(rate)
    }
    const handleStorePos = (pos : number) => {
           setStoreScrollPos(pos)
    }

    const handleSellerActive = (active:boolean) => {
           setSellerIsActive(active)
    }

    const handleLogout = () => {
        localStorage.clear()
        // localStorage.removeItem('token');
        // localStorage.removeItem('role');
        // localStorage.removeItem('adminToken');
        // localStorage.removeItem('status');
        // localStorage.removeItem('storeId')
        // localStorage.removeItem('completed');
        dispatch(deleteToken());
        setIsLoggedIn(false)
    }


    const handleRefetch = () => {
        setIsRefetch((prev) => !prev)
    }
    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const [ratingId, setRatingId] = useState<string>('')
    const [cartLength, setCartLength] = useState<number>(0);
        // const onSuccess = (data: TCart) => {
        //     console.log(data?.products?.length)
        //     setCartLength(data?.products?.length);
        // }
    // const { refetch } = useGetCart(onSuccess);
    // const handleRefetchCart = () => {
    //     refetch()
    // }
    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         refetch()
    //     }, 1000)
    //     return () => clearTimeout(timeout);
    // },[])
    const handleRatingId = (id: string) => {
        setRatingId(id)
    }
    const clearRatingId = () => {
        setRatingId('')
    }
    const handleRateChange = async () => {
        const response = await axios.get('https://api.striperates.com/rates/usd', {
            headers : {
                'x-api-key' : key
            }
        });
        const data = response.data;
        const gbp =  data.data[0].rates.gbp
        setRate(rate)
    }
    const onAdminLogin = () => {
        setIsLoggedIn(prevState => !prevState)
    }
    const handleUpdateCart = () => {
        setIsUpdating(prevState => !prevState)
    }
    const [cartChange, setCartChange] = useState<boolean>(false);

    const handleCartChange = () => {
        setCartChange(prevState => !prevState)
    }
    const handleUpdateSellerId = (id: string) => {
        setSellerId(id)
    }
    const handleRole = (role: string) => setRole(role);
    const handleName = (name : string) => setName(name);
    const context = {
        isUserLoggedIn,
        isLoggedIn,
        handleRole,
        handleName,
        handleLogout,
        handleIsSeller,
        isSeller,
        onAdminLogin,
        handleIsNotSeller,
        isAdminLoggedIn,
        name,
        adminRate,
        handleAdminRate,
        rate,
        handleRefetch,
        handleRateChange,
        role,
        adminConfig,
        config,
        handleRatingId,
        sellerIsActive,
        handleSellerActive,
        clearRatingId,
        storeScrollPos,
        ratingId,
        isUpdating,
        handleUpdateCart,
        cartChange,
        sellerId,
        handleUpdateSellerId,
        handleStorePos,
        handleCartChange
    }
    return (
        <ContextApi.Provider value={context}>
            {children}
        </ContextApi.Provider>
    )
}
export default ContextProvider;