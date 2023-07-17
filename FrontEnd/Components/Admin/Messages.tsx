import React from "react";
import {Card, Stack, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";

const Messages : React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const  router = useRouter()
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
            <Typography variant={'h6'}>All Messages</Typography>
            <Box sx={{border: '2px solid black', my:1, maxWidth: '600px'}}>
                <Stack sx={{border: '1px solid black', p: 0.5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography variant={'h6'}>John Doe</Typography>

                    <Avatar variant={'circular'}  sx={{color: 'white', bgcolor: 'black'}}>
                        +1
                    </Avatar>
                </Stack>
            </Box>
        </Card>
    )


}
export default Messages;