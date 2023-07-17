import Box from "@mui/material/Box";
import {Card, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {AddBoxOutlined, AddTask} from "@mui/icons-material";
import {useRouter} from "next/router";

interface IaddItems  {
    title: string
}
const AddItemCards : React.JSXElementConstructor<IaddItems> = ({title}) => {
    const router = useRouter();
return (
    <>
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', mb:2, mt:2, maxWidth: '300px'}}>
            <Stack direction={'row'} spacing={2} >
                <Typography variant={'h6'} >{title}</Typography>
           <div onClick={() => router.push('/seller/post')}> <AddBoxOutlined sx={{color: '#54991D', mt:0.5}}  /></div>
            </Stack>
            <Card className={'package'}  onClick={() => router.push('/seller/post')} sx={{height: {xs : '150px', sm: '170px'}, borderRadius: '2px solid #54991D', p:2, color: '#54991D', textAlign:'center'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography variant={'body1'} component={'h6'} mt={5}>Add your first item </Typography>
                    <AddTask />
                </Box>
            </Card>
        </Box>
    </>
)

}
export  default AddItemCards;