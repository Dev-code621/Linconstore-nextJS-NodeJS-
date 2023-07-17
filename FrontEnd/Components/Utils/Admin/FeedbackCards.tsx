import React from "react";
import {Card, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {contactUsDefaultValue} from "../../../Helpers/Types";


const FeedbackCards  : React.FC<contactUsDefaultValue> = ({message, name, email}) => {

    return (
        <Card elevation={1} className={'pointer'} sx={{width: '100%', p:2, bgcolor: '#fff', color: '#000', border: '2px solid black', borderRadius : '7px'}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography textAlign={'justify'} variant={'subtitle2'} sx={{mb:1}}>
                {message}
            </Typography>
                <Stack spacing={1}  direction={'row'}>
                    <Avatar variant={'circular'}>{name.slice(0, 2)}</Avatar>
                    <Stack>
                        <Typography variant={'body1'}>{name}</Typography>
                        <Typography variant={'subtitle2'}>{email}</Typography>
                    </Stack>
                </Stack>
            </Box>

        </Card>

    )

}
export default FeedbackCards;