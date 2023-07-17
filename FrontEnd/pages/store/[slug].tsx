import { GetServerSideProps } from "next";
import Brands from "../../Components/Brands/Brands";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import {TRating, TStoreId} from "../../Helpers/Types";
import React from "react";
import {capitalizeFirstLetter} from "../../Helpers/utils";
type TProducts = {
  discount: number;
  title: string;
  photo: string[];
  owner: TStoreId;
  price: number;
  quantity: number;
  ratingId: TRating;
  _id: string;
};
interface IProducts {
  products: TProducts[];
  image: string;
  name: string;
  description: string;
}
const BrandsPage: React.FC<IProducts> = ({
  products,
  image,
  description,
  name,
}) => {
  return (
    <Brands products={products} image={image} description={description} name={name} />
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const {id, pass} = context.params as unknown  as IReset;
  const slug: string | undefined | any = context.params?.slug;
  const store_name = capitalizeFirstLetter(slug);
  try {
    const response = await axios.get(`${baseUrl}/findstore?name=${store_name}`);
    const products = response.data.products;
    const image = response.data.image;
    const name = response.data.name;
    const description = response.data.description;
    return {
      props: {
        products,
        image,
        name,
        description,
      },
    };
  } catch (e) {
    return {
      redirect : {
        permanent: true,
        destination: '/'
      },
      props: {
        data: false,
      },

    };
  }
};
export default BrandsPage;
