import * as React from 'react';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {addAdminModalClose, handleCloseModal, modalClose, requestModalClose, updateModal} from "../../../Store/Modal";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import Button from "@mui/material/Button";
import TextInput from "../../TextInput";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {CircularProgress, FormControl, FormHelperText, InputLabel, Select, Stack} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {useGetAdmin, useUpdateAdmin} from "../../../hooks/useDataFetch";
import {useEffect} from "react";
interface modal {
    modal : {
        addAdminModal : boolean,
        productId: string
    }
}
const style  = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 350,
    maxHeight: 450,
    borderRadius: 5,
    p: 1,
};
const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required().min(6),
    section: yup.string().required()
})
type addAdmin = {
    email: string,
    password: string,
    section: string
}
export default function AddAdminModal() {
    const {  handleSubmit, control, getValues, reset,watch, formState : {errors} } = useForm<addAdmin>({
        resolver: yupResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: '',
            section: ''
        }
    })
    const onSubmit: SubmitHandler<addAdmin> = async (data) => {
        const {email, section, password} = data;
        const newData = {
            email,
            section,
            password
        }
        updateAdmin(newData)
    };
    const dispatch = useDispatch();
    const open : boolean = useSelector((state: modal) => state.modal.addAdminModal);
    const handleClose = () => dispatch(addAdminModalClose());
    const onSuccess = (data: addAdmin) => {
        reset(data)
    }
    useEffect(() => {
        console.log(open);
        if (open) {
          setTimeout(() => {
              refetch()
          },1000)
        }
    }, [open])
    const onUpdateSuccess = () => {
        reset();
        dispatch((updateModal()))
        reset();
        handleClose()
    }
    const {isLoading, mutate: updateAdmin} =useUpdateAdmin(onUpdateSuccess)
    const {isFetching, refetch} = useGetAdmin(onSuccess);
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container maxWidth={'lg'} component={'main'}>
                <Box sx={style}  >
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, mx:2 }}>
                        {/*{loginLoading && <Loader/>}*/}
                        {isFetching && <CircularProgress/>}
                        <FormControl sx={{minWidth: 200}} >
                            <InputLabel  id="demo-simple-select-label"  shrink={false}>
                                {watch('section') === ''  &&    'Select admin section'}</InputLabel>
                            <Controller
                                name='section'
                                control={control}
                                render={({field, formState: {errors}}) => (
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        {...field}
                                        variant={'outlined'}
                                        className={'sortButton'} sx={{bgcolor: '#fff', color: '#000', border: '2px solid black',
                                        "& .MuiSvgIcon-root": {
                                            color: "black",
                                        }
                                    }}
                                    >
                                        <MenuItem value={"Blog "}>Blog admin</MenuItem>
                                        <MenuItem value={'verify'}>Verify admin</MenuItem>
                                        <MenuItem value={'store'}>Store admin </MenuItem>
                                        <MenuItem value={'general'}>general </MenuItem>
                                        <MenuItem value={'analysis'}>Analysis admin</MenuItem>
                                        <MenuItem value={'support'}>CS support  </MenuItem>
                                        <MenuItem value={'marketing'}>marketing admin  </MenuItem>

                                    </Select>
                                )
                                }
                            />
                            <FormHelperText sx={{color: 'red'}}>{errors?.section?.message} </FormHelperText>
                        </FormControl>
                        <Controller
                            name='email'
                            control={control}
                            render={({field, formState: {errors}}) => (
                                <TextInput
                                    data={errors?.email} field={field} id='Username'
                                />
                            )
                            }
                        />
                        <Controller
                            name='password'
                            control={control}
                            render={({field, formState: {errors}}) => (
                                <TextInput
                                    data={errors?.password} field={field} id='Password' type={'password'}
                                />
                            )
                            }
                        />
                        <Stack sx={{display: 'flex', mt:2}}>
                            <Box flexGrow={1}/>
                            <Button
                                className={'color'}
                                disabled={isLoading}
                                type="submit"
                                variant="contained"
                                sx={{alignSelf: 'flex-end'}}
                            >
                                {isLoading && <CircularProgress/>}
                                Save
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
}
