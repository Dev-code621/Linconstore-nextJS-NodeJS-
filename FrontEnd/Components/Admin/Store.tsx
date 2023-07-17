import React, {useCallback, useEffect, useState} from "react";
import {Card, CircularProgress, Stack, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";
import Search from "../Utils/Search";
import SellersTable from "../Utils/Admin/SellersTable";
import {useAdminSellers, useFetchAdminStores, useFetchStores} from "../../hooks/useDataFetch";
import {TAdminSeller, TSellerStore, TStoreId} from "../../Helpers/Types";
import {useSelector} from "react-redux";
import {currencies} from "../Layouts/Seller/Dashboard";
import StoreTable from "../Utils/Admin/StoreTable";
import {useTokenRefetch} from "../../hooks/useRefresh";
interface Iupdate {
    payout : {
        isUpdating : boolean
    }
}
interface IAdminPayout  {
    seller: TSellerStore,
    length: number,
    balance: number
}

const Store : React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const  router = useRouter()
    const [search, setSearch] = useState<string>('');
    const [stores, setStores] = useState<IAdminPayout[]>([]);

    const handleChange = useCallback((event : React.ChangeEvent<HTMLInputElement>) => {
        const search = event.target.value;
        setSearch(search);
        const newSearchValue = search.toLowerCase();
        const newSeller = data?.filter((seller : IAdminPayout) => seller?.seller?.storeId?.name?.toLowerCase().includes(newSearchValue));
        setStores(newSeller)
    },[search])
    const onSuccess = (data : IAdminPayout[]) => {
        
        setStores(data)
    }
    const {data, isFetching, isFetched, refetch} = useFetchStores(onSuccess);
    useTokenRefetch(refetch)

    const isUpdating = useSelector((state : Iupdate) => state.payout.isUpdating);
    const handleRefetch = useCallback(() => {
        refetch()
    },[isUpdating])
    return (
        <Card elevation={0} sx={{ background:'#f3f2f2', mt:1, p:2, minHeight: '90vh'}}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                {isMobile && <ArrowBack  onClick={() => router.back()} className={'pointer'}/> }
            </Box>
            <Stack spacing={0} sx={{display: 'flex', p:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Stack direction={'row'} spacing={2} sx={{minWidth: '100%'}}> <Typography variant={'h6'} sx={{mt:4, minWidth: '120px'}}>Payouts</Typography>
                    <Box sx={{width: 500}}>
                        <Search search={search} handleChange={handleChange}/>
                    </Box>
                </Stack>
                <Typography variant={'h6'} sx={{mt:4}}>{stores?.length} </Typography>
            </Stack>
            <Box>
                {isFetching && <CircularProgress/>}
                {isFetched && stores?.length > 0 &&
                    <StoreTable handleRefetch={handleRefetch} stores={stores}/>
                }
            </Box>
        </Card>
    )
}
export default Store;