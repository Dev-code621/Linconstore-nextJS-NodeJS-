import React, {useState} from "react";
import {Card, CircularProgress, Grid, Stack, Typography, useMediaQuery} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {ArrowBack} from "@mui/icons-material";
import {useRouter} from "next/router";
import FeedbackCards from "../Utils/Admin/FeedbackCards";
import {contactUsDefaultValue} from "../../Helpers/Types";
import {useFetchFeedbacks} from "../../hooks/useDataFetch";
import {useTokenRefetch} from "../../hooks/useRefresh";

const Feedback : React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const  router = useRouter();

    const [feedBacks, setFeedBacks] = useState<contactUsDefaultValue[]>([]);
    const onSuccess = (data : contactUsDefaultValue[]) => {
        setFeedBacks(data)
    }
    const {isLoading, refetch} = useFetchFeedbacks(onSuccess)
    useTokenRefetch(refetch)
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
            <Typography variant={'h6'}>Feedback</Typography>
            <Typography variant={'h6'} textAlign={"center"}>{isLoading && <CircularProgress/>}</Typography>
            <Box sx={{my:1}}>
                    <Grid container spacing={2}>
                        {feedBacks.map(({message, name, phone, email}, index) => (
                            <Grid key={index} item xs={12} sm={6} md={4}>
                                <FeedbackCards email={email} message={message} name={name} phone={phone}/>
                            </Grid>
                        ))}
                    </Grid>
            </Box>
        </Card>
    )


}
export default Feedback;