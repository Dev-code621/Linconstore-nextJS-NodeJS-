
import * as React from "react";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import {closeSellerPayoutModal, closeTermModal} from "../../../Store/Modal";
import Container from "@mui/material/Container";
import CloseIcon from '@mui/icons-material/Close';

import Box from "@mui/material/Box";
import {
    CircularProgress, Divider,
    FormControl,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    Stack,
    Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { auto } from "@popperjs/core";
import { useTranslation } from "react-i18next";
import {
    useGetSellerInfo,
    useGetSellerLink,
    useRemoveSellerOnboard,
    useSellerOnboard
} from "../../../hooks/useDataFetch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useCallback, useState} from "react";
import {Tseller} from "../../../Helpers/Types";
import {useTokenRefetch} from "../../../hooks/useRefresh";

interface modal {
    modal: {
        sellerPayoutModal: boolean;
    };
}
const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    minWidth: "300px",
    // border: '2px solid #000',
    boxShadow: 24,
    display: "flex",
    bgcolor: "rgba(255,255,255,1)",
    color: "#363232",
    flexDirection: "column",
    alignItems: "center",
    height: auto,
    overflow: "auto",
    borderRadius: 5,
    p: 1,
};
type TLink = {
    url: string;
};
export default function SellerPayoutModal() {
    const dispatch = useDispatch();

    const [value, setValue] = React.useState('stripe');
    const [isConnect, setIsConnect] =  useState<boolean>(false)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const open: boolean = useSelector((state: modal) => state.modal.sellerPayoutModal);
    const handleClose = () => dispatch(closeSellerPayoutModal());
    const { t } = useTranslation();

    const onSellerLinkSuccess = (data: TLink) => {
        window.open(data.url, "_blank", "noopener,noreferrer");
        handleClose()
    };
    const { refetch: refetchSellerLink, isLoading: isGetting } =
        useGetSellerLink(onSellerLinkSuccess);

    const onSellerSuccess = (data : Tseller) => {
        if (data?.accId){
            setIsConnect(true)
        }
        else {
            setIsConnect(false)
        }
    }

    const {refetch: sellerRefetch} = useGetSellerInfo(onSellerSuccess);

    useTokenRefetch(sellerRefetch)
    const onRemoveSuccess = () => {
        sellerRefetch()
    }
    const {mutate, isLoading: isRemoving} = useRemoveSellerOnboard(onRemoveSuccess);

    const handleSellerLink = () => {
        refetchSellerLink();
    };
    const onSuccess = (data: TLink) => {
        window.open(data.url, "_blank");
        handleClose()
    }
    const {refetch, isLoading} = useSellerOnboard(onSuccess);

    const handleDelete = () => {
        mutate()
    }
    const handleRefetch = () => {
        refetch()
    }
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Container maxWidth={"md"} component={"main"}>
                <Box sx={style}>
                    <Stack direction={'row'} spacing={2} sx={{display: 'flex', mt:1}}>
                        <Box sx={{ flexGrow: 1 }} >
                            <Box/>
                            <Typography variant={'subtitle1'} sx={{mt:0.7}}>Add Payout Method</Typography>
                        </Box>
                        <Box/>
                        <Box sx={{  alignSelf: "flex-end" }}>
                            {/*<Button*/}
                            {/*    onClick={handleClose}*/}
                            {/*    color={"error"}*/}
                            {/*    startIcon={<Close />}*/}
                            {/*    size={"small"}*/}
                            {/*    variant={"outlined"}*/}
                            {/*>*/}
                            {/*</Button>*/}
                            <IconButton  onClick={handleClose}  aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Stack>
                    <FormControl>
                        {/*<FormLabel id="demo-controlled-radio-buttons-group">Select</FormLabel>*/}
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel disabled={true} value="bank" control={<Radio />} label="Bank account" />
                            <FormControlLabel disabled={true}   value="paypal" control={<Radio />} label="Paypal" />
                            <FormControlLabel value="stripe" control={<Radio />} label="Store Prepaid Card" />
                        </RadioGroup>
                    </FormControl>
                    <Box sx={{my:2, display: 'flex',  flexDirection: 'row', justifyContent: 'space-between'}}>
                         <Button variant='outlined'
                                sx={{borderRadius: '25px'}}   disabled={!isConnect || isRemoving}  color='error' onClick={handleDelete} >
                             {isRemoving && <CircularProgress/>}  Remove

                         </Button>
                        <Box sx={{mx:4}}/>

                        {!isConnect && <Button variant='contained'
                                sx={{borderRadius: '25px'}} disabled={isLoading}   color='success' onClick={handleRefetch} >
                            {isLoading && <CircularProgress/>} Connect
                        </Button>
                        }
                        {isConnect && <Button variant='contained'
                                sx={{borderRadius: '25px'}} disabled={isGetting}   color='success' onClick={handleSellerLink} >
                            {isGetting && <CircularProgress/>} View
                        </Button>
                        }
                    </Box>
                </Box>
            </Container>
        </Modal>
    );
}
