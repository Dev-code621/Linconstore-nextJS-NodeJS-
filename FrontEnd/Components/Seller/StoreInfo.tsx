import * as React from 'react';
import Box from "@mui/material/Box";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextInput from "../TextInput";
import TextField from "@mui/material/TextField";
import {Autocomplete, CircularProgress, FormHelperText, Stack, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import {decrement, increment} from "../../Store/Stepper";
import {ArrowBack, PhotoCamera} from "@mui/icons-material";
import Logo from "../Utils/Logo";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import {useRouter} from "next/router";
import {useGetAllCategories, useGetStoreInfo, useSellerOnboard, useSellerStore} from "../../hooks/useDataFetch";
import {uploadImage} from "../../Helpers/utils";
import axios from "axios";
import {baseUrl} from "../../Helpers/baseUrl";
type Store_info = {
    name: string,
    store_summary: string,
    category: string,
    currency : string,
    location: string,
    attachment: File | null
}
type  currencies = {
    value : string,
    label : string
}
const currencies : currencies[] = [
    {
        value: 'USD',
        label: '$-USD',
    },
    {
        value: 'EUR',
        label: '€-EUR',
    },
    {
        value: 'Pounds',
        label: '£-GBP',
    }
];
export const categoryOptions : string[] = ['Animal', 'Art & Craft', 'Baby', 'Carriers', 'Cleaning','Clothing', 'Electronic', 'Furniture', 'Garden & terrace',
'cooking', 'Home', 'Jewelry', 'Media', 'Music', 'Occasion and event'];

const StoreInfo : React.JSXElementConstructor<any> = () => {
    const schema = yup.object().shape({
        name: yup.string().required('you must provide a name for your store').min(4)
            .test('unique-username', 'Username is already taken', async (value) => {
                try {
                    const response = await axios.get(`${baseUrl}/store/unique-name?storename=${value}`);
                    const data = response.data;
                    return !data; // Return true if the username is unique, false otherwise
                } catch (error) {
                    console.error('Error checking username:', error);
                    return false; // Return false if an error occurs
                }
            }),
        store_summary: yup.string().required('summary is required').min(8),
        // category: yup.array().of(yup.string()).required(),
        currency: yup.string().required(),
        location: yup.string().required(),
        attachment: yup.mixed().required('You Must upload a logo').test("fileSize", "File Size is too large", (value) => {
            if (value){
                return     value.size <= 2000000;
            }
            return  false;
        }).test("fileType", "Unsupported File Format", (value) => {
            if(value) {
             return   ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
            }
            return false;
            }
            ),
    })
    const {  handleSubmit, control, getValues, watch, setValue, reset, formState:{errors} } = useForm<Store_info>({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            store_summary: '',
            // category: '',
            currency: 'Pounds',
            location: '',
            attachment: null
        }
    })
    const dispatch = useDispatch();
    const [cat_error, setCat_error] = useState<boolean>(false);
    const [limit, setLimit] = useState<string>('');
    const router = useRouter();
    const onSellerStoreSuccess = (data: any) => {
        localStorage.setItem('role', 'seller');
        localStorage.setItem('completed', 'true')
        const status = localStorage.getItem("status");
        if (status !== "seller") {
            localStorage.removeItem("status");
        }
        router.push('/seller')
    }
    // const {isLoading: isLoadingOnboard,refetch,} = useSellerOnboard(onSellerStoreSuccess)
    const onSuccess = (data : any) => {
        reset()
        localStorage.setItem('role', 'seller');
        localStorage.setItem('completed', 'true')
        const status = localStorage.getItem("status");
        if (status !== "seller") {
            localStorage.removeItem("status");
        }
        router.push('/seller')
    }
    const {isLoading, isSuccess: isCreateSuccess, error, isError, mutate: createStore} = useSellerStore(onSuccess)
    const onSubmit : SubmitHandler<Store_info> = useCallback(async (data,event) => {
        // data.attachment = event?.target.attachment.files
        const logo = await uploadImage(data.attachment);
        // create post here
        const {currency, category, store_summary, name, location} = data
        const postStore = {
            logo,
            location,
            name,
            // categories: category,
            currency,
            summary: store_summary
        }
        createStore(postStore)

    },[cat_error, createStore])
    type ICategories = {
        title : string
    }
    const [limitPlan, setLimitPlan] = useState<number>();
    const [categories, setCategories] = useState<ICategories []>([]);
    const {isSuccess, data} = useGetStoreInfo();
    useEffect(() => {
        if (isSuccess){
            const {categories, limit} = data;
            const categoryArray: any[]  = [];
            categories.forEach((category: { title: string; }) => categoryArray.push(category.title));
            setCategories(categoryArray)
            setLimitPlan(limit)
        }
    },[data, isSuccess])
    const uploadInputRef = useRef<HTMLInputElement>(null);
    return (
        <>
             <Box sx={{mx: {xs : 2, md:0}, mt:2, mb:2, display: 'flex', flexDirection: 'column',  justifyContent: 'center'}}>
                {/*<span onClick={() => dispatch(decrement(1))} className={'pointer'}><ArrowBack/></span>*/}
                 <Typography variant={'h6'} textAlign={'center'}>Setting up your store</Typography>
                 {/*<Stack spacing={2} sx={{display: 'flex', flexDirection: 'row', p: 2}}>*/}
                 {/*    {isCreateSuccess  &&   <Typography variant={'subtitle2'}>  {isLoadingOnboard && <CircularProgress/>} You will be redirected shortly</Typography>}*/}
                 {/*</Stack>*/}
                 <Box component={'form'} onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 0 }}>
                     <Avatar
                         src={
                             watch('attachment')
                                 ? URL.createObjectURL(watch('attachment') as File)
                                 : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                         }
                         alt="photo preview"
                         sx={{ width: "200px", height: "200px" , mb:2 }}
                     />

                     <Controller
                         name="attachment"
                         control={control}
                         render={({field: {onChange}, formState: {errors}}) => (
                    <> <input
                         type="file"
                         accept="image/*"
                         hidden
                         id={'attachment'}
                         onChange={(e: ChangeEvent<HTMLInputElement>) => {
                             setValue('attachment', e.target.files && e.target.files[0]);
                         }}
                     />
                     <Tooltip   key="Select Image" title={'Business picture'}>
                         <label htmlFor="attachment" >
                         <Button
                             variant="contained"
                             component="span"
                             startIcon={<PhotoCamera fontSize="large" />
                             }
                         >
                             Upload
                         </Button>
                         </label>
                     </Tooltip>
                    </>
                         )
                         }
                     />
                     <FormHelperText sx={{color: 'red'}} >{errors?.attachment?.message}</FormHelperText>
                     <Controller
                         name='name'
                         control={control}
                         render={({field, formState: {errors}}) => (
                             <TextInput
                                 data={errors?.name} field={field} id='What is your store name'
                             />
                         )
                         }
                     />
                     <Controller
                         name='store_summary'
                         control={control}
                         render={({field, formState: {errors}}) => (
                             <TextInput
                                 data={errors?.store_summary} field={field} id='Give us a short summary of your store'
                             />
                         )
                         }
                     />
                     {/*<Controller*/}
                     {/*    name='category'*/}
                     {/*    control={control}*/}
                     {/*    render={({field : {onChange, value}, formState: {errors}}) => (*/}
                     {/*<Autocomplete*/}
                     {/*    multiple*/}
                     {/*    aria-required={true}*/}
                     {/*    id="cats-options"*/}
                     {/*    options={categories}*/}
                     {/*    getOptionDisabled={() => (limit.length === limitPlan)}*/}
                     {/*    // getOptionLabel={(title) => title}*/}
                     {/*    renderInput={(params) => (*/}
                     {/*        <TextField*/}
                     {/*            sx={{mt:2}}*/}
                     {/*            {...params}*/}
                     {/*            variant="standard"*/}
                     {/*            required*/}
                     {/*            error={!!errors?.category || cat_error}*/}
                     {/*            helperText={!!errors.category  || cat_error ? 'You must choose a category' : ''}*/}
                     {/*            label="Categories"*/}
                     {/*            placeholder="Categories"*/}
                     {/*        />*/}
                     {/*    )}*/}
                     {/*    onChange={(e, data) => {*/}
                     {/*        onChange(data);*/}
                     {/*        setCat_error(false)*/}
                     {/*       setLimit(getValues('category'));*/}
                     {/*    }*/}
                     {/*}*/}
                     {/*/>*/}
                     {/*    )*/}
                     {/*    }*/}
                     {/*/>*/}
                     {/*{limit.length === limitPlan &&  <FormHelperText > You can not select more than {limitPlan} categories   </FormHelperText>}*/}
                     <Controller
                         name='location'
                         control={control}
                         render={({field, formState: {errors}}) => (
                             <TextInput
                                 data={errors?.location} field={field} id='business location'
                             />
                         )
                         }
                     />
                     <Controller
                         name='currency'
                         control={control}
                         render={({field : {onChange, value}, formState: {errors}}) => (
                     <TextField
                         id="outlined-select-currency"
                         select
                         fullWidth
                         margin="normal"
                         variant={'standard'}
                         label="Currency"
                         error={!!errors?.currency}
                         onChange={onChange}
                         value={value}
                         required={true}
                         helperText={errors ? errors?.currency?.message : "Please select your currency"}
                     >
                         {currencies.map(( currency, index) => (
                             <MenuItem key={currency.value + index} value={currency.value}>
                                 {currency.label}
                             </MenuItem>
                         ))}
                     </TextField>
                         )}
                             />
                     {isError && <FormHelperText sx={{color: 'red'}}>{error?.response?.data?.status}</FormHelperText> }
                     <Button   disabled={isLoading} variant='contained' fullWidth type='submit' className={'buttonClass'} sx={{mt:3}}>
                         Personalize your store  {isLoading && <CircularProgress/>}
                     </Button>
                 </Box>
         </Box>
        </>
    )

}
export default StoreInfo;