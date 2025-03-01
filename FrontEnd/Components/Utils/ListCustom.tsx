import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import * as React from "react";
import {useRouter} from "next/router";
import Link from "next/link";
type manage = {
    title: string,
    link: string
}
interface Ilist{
    listItems : manage,
}

const ListCustom : React.JSXElementConstructor<Ilist>  = ({listItems}: Ilist) => {
    // console.log(listItems.link)
    const router = useRouter();
    return (
        <>
        <ListItem disablePadding>
            <ListItemButton  >
                    <ListItemText  onClick={() => router.push(listItems.link)} primary={listItems.title} />
            </ListItemButton>
        </ListItem>
        </>

    )

}
export default ListCustom;