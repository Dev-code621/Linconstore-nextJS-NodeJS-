import * as React from 'react';
import Button from '@mui/material/Button';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CircularProgress,
    FormControl, FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel, Select,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/router';
import Holder from "../Wappers/Holder";
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {baseUrl} from "../../Helpers/baseUrl";
import {usePostUserRefunds} from "../../hooks/useDataFetch";
import {useDispatch} from "react-redux";
import {snackBarOpen} from "../../Store/Utils";
const schema = yup.object().shape({
    reason: yup.string().required(),
})
type reset = {
    reason : string
}
export default function Refund() {
    const isMobile: boolean = useMediaQuery((('(max-width : 300px)' )));
    const {  handleSubmit, control, getValues, reset, watch, formState: {errors} } = useForm<reset>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            reason: '',
        }
    })
    const router = useRouter();
    const [title, setTitle] = useState<string>('');
    const [productId, setProductId] = useState<string>('')
    const handleFetchProduct =  async (id: string ) => {
        const response = await axios.get(`${baseUrl}/product/${id}`);
            const data = response.data;
            setProductId(id)
            setTitle(data.title)
    }
    useEffect(() => {
        const {q}  = router.query;
        handleFetchProduct(q as string)
    }, [])
    // React.useEffect(() => {
    //     if(isSuccess){
    //         reset()
    //     }
    //     if(isError && !isSuccess){
    //         reset({
    //             ...getValues(), password: ''
    //         })
    //     }
    // }, [isSuccess, isError])

    const onSubmit: SubmitHandler<reset> = async (data) => {
            const {reason} = data;
            const newData  = {
                productId,
                reason
            }
            postRefund(newData)
        // const signInData = {
        //     password: data.password,
        //     email: data.email,
        //     returnSecureToken: true
        // }
        // mutate(signInData)
    };
    const dispatch = useDispatch();
    const onSuccess = () => {
        reset()
        dispatch(snackBarOpen({
            message: 'refund created successfully', severity: 'success', snackbarOpen: true, rate: 0,
            sellerRate: 0
        }))
        router.back()
    }

    const [verifyEmail, setVerifyEmail] = React.useState<boolean>(false);
    const {isLoading, mutate: postRefund, isError} = usePostUserRefunds(onSuccess)
    useEffect(() => {
        if (isError) {
            dispatch(snackBarOpen({
                message: 'something went wrong ', severity: 'warning', snackbarOpen: true, rate: 0,
                sellerRate: 0
            }))
        }
    }, [isError])
    return (
        <>
            {!verifyEmail &&
                <Holder>
                    <Grid container mt={4}>
                        <Grid item xs={0} sm={3}/>
                        <Grid item xs={12} sm={6}>
                            <Stack component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                                <Stack direction={'row'} spacing={3}>
                                    <Typography variant={'h6'}> Selected Item : </Typography>
                                    <Typography variant={'h6'}> {title}</Typography>
                                </Stack>
                                {/*{loginLoading && <Loader/>}*/}
                                {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}
                                <Toolbar/>
                                <Stack spacing={4} direction={'row'}>
                                    <Typography variant={'h5'}> Refund reason</Typography>
                                    <FormControl sx={{minWidth: 170}}  >
                                    <InputLabel  id="demo-simple-select-label"  shrink={false}>
                                        {watch('reason') === ''  &&    'Select a reason'}</InputLabel>
                                    <Controller
                                        name='reason'
                                        control={control}
                                        render={({field, formState: {errors}}) => (
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                {...field}
                                                variant={'outlined'}
                                                className={'sortButton'} sx={{bgcolor: '#fff', height:45, color: '#000', border: '2px solid black',
                                                "& .MuiSvgIcon-root": {
                                                    color: "black",
                                                }
                                            }}
                                            >
                                                <MenuItem value={"Item does not match description "}>Item does not match description  </MenuItem>
                                                <MenuItem value={'Item was damaged upon arrival'}>Item was damaged upon arrival</MenuItem>
                                                <MenuItem value={'Seller shipped a wrong item'}>Seller shipped a wrong item</MenuItem>
                                                <MenuItem value={'Item arrived late'}>Item arrived late</MenuItem>
                                                <MenuItem value={'Item is of poor value'}>Item is of poor value</MenuItem>
                                                <MenuItem value={'Item doesnt fit (wrong size)'}>Item doesnt fit (wrong size)</MenuItem>

                                            </Select>
                                        )
                                        }
                                    />

                                    <FormHelperText sx={{color: 'red'}}>{errors?.reason?.message} </FormHelperText>
                                </FormControl>
                                </Stack>
                                <Stack  my={2}>
                                    <Typography variant={'body1'}>
                                        The seller of this product will get back to you within 24hours when you submit
                                        your request.
                                    </Typography>
                                    <Typography variant={'body1'}>
                                        Contact us after 24 hours of no response from the seller
                                        <br/>
                                        <u>    <Link href={'/contact'}> Contact us </Link></u>
                                    </Typography>
                                </Stack>
                                <Stack spacing={1}>
                                    <Button
                                        disabled={isLoading}
                                        className={'buttonClass'}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{mt: 3, mb: 2, backgroundColor: '#54991D'}}
                                    >
                                        {isLoading && <CircularProgress/>}
                                        Request Refund
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={0} sm={3}/>
                    </Grid>
                </Holder>
            }
        </>
    );
}