import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import {
    CircularProgress,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/router';
import { loginUserDefaultValue } from '../../Helpers/Types';
import TextInput from '../TextInput';
import Holder from "../Wappers/Holder";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import AdminVerify from "./AdminVerify";
import {useAdminLogin} from "../../hooks/useDataFetch";
const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(6)
})
type TAdmin = {
    email : string
}
export default function AdminLogin() {
    // const isMobile: boolean = useMediaQuery((('(max-width : 300px)' )));
    const {  handleSubmit, control, getValues, reset } = useForm<loginUserDefaultValue>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const router = useRouter();
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
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [email, setEmail] = useState<string>('')

    const onSuccess = (data : TAdmin) => {
        setEmail(data.email)
        setAdminVerify(true)
    }
    const {isError, error, isLoading, mutate :  loginAdmin} = useAdminLogin(onSuccess);
    const [errorMessage, setErrorMessage] = useState<string>('');
    useEffect(() => {
        if (error instanceof Error){
            // @ts-ignore
            setErrorMessage(error?.response?.data?.status);
        }
    },[isError]);

    const onSubmit: SubmitHandler<loginUserDefaultValue> = async (data) => {
        reset()
        const signInData = {
            password: data.password,
            email: data.email,
        }
        loginAdmin(signInData)
    };
    const [adminVerify, setAdminVerify] = useState(false);
    return (
        <>
            {!adminVerify &&
                <Holder>
                    <Grid container mt={4}>
                        <Grid item xs={0} sm={3}/>
                        <Grid item xs={12} sm={6}>
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{mt: 1}}>
                                <Typography variant={'h5'}> Admin Dashboard </Typography>
                                {/*{loginLoading && <Loader/>}*/}
                                {/*{isError && <FormHelperText sx={{color: 'red'}}> {error?.response?.data?.error?.message}</FormHelperText>}*/}
                                <Controller
                                    name='email'
                                    control={control}
                                    render={({field, formState: {errors}}) => (
                                        <TextInput
                                            data={errors?.email} field={field} id='Email' type={'email'}
                                        />
                                    )
                                    }
                                />
                                <Controller
                                    control={control}
                                    name='password'
                                    render={({field, formState: {errors}}) => (
                                        <TextField
                                            label='Enter Password'
                                            variant="standard"
                                            margin={'normal'}
                                            fullWidth
                                            className={'loginPass'}
                                            error={!!errors?.password}
                                            helperText={errors?.password?.message}
                                            type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                                            {...field}
                                            InputProps={{ // <-- This is where the toggle button is added.
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                                {isError &&  <FormHelperText sx={{color: 'red'}}> {errorMessage} </FormHelperText>}
                                <Stack spacing={1}>
                                    <Button
                                        // disabled={isLoading}
                                        className={'buttonClass'}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{mt: 3, mb: 2, backgroundColor: '#54991D'}}
                                    >
                                        {isLoading && <CircularProgress/>}
                                        Login
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid item xs={0} sm={3}/>
                    </Grid>
                </Holder>
            }
            {adminVerify && <AdminVerify email={email} setAdminVerify={setAdminVerify}/>}
        </>
    );
}