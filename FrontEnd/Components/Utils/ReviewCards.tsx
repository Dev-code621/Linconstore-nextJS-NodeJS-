import {Avatar, Box, Card, Paper, Rating, Stack, Typography, useMediaQuery} from "@mui/material";

interface Ireviews{
    rate: number,
    description: string,
    name: string
}
const ReviewCards : React.JSXElementConstructor<Ireviews> = ({rate, description, name}) => {
    const isMobile : boolean = useMediaQuery('(max-width:400px)')
    return(
        <Box sx={{minWidth: 100}}>
         <Card className="" >
            <Box sx={{display: 'flex', flexDirection:'row', p: isMobile ? 1 : 2}}>
            <Avatar variant="circular" sx={{mr:2}}>{name.split('')[0]}</Avatar>
            <Stack>
                <Stack direction={ isMobile ? 'column' : 'row'} justifyContent={'space-between'} sx={{maxWidth: '200px'}}  >
                    <Typography variant="body1">{name}</Typography>
                        <Rating name="product_rating" value={rate} readOnly />
                </Stack>
                <Typography variant="subtitle2">{description}</Typography>
            </Stack>
            </Box>
         </Card>
        </Box>
    )
}
export default ReviewCards;