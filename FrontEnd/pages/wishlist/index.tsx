import { NextPage } from "next";
import Wishlist from "../../Components/Wishlist/Index";
import { useContext, useEffect } from "react";
import ContextApi from "../../Store/context/ContextApi";
import { useRouter } from "next/router";

const WishlistPage: NextPage = () => {
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) router.push('/login')
  }, [router]);
  return <Wishlist />;
};
export default WishlistPage;
