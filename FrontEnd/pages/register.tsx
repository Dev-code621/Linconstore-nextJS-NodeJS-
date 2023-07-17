import { NextPage } from "next";
import RegisterPage from "../Components/Auth/Register";
import { NextSeo } from "next-seo";
import Head from "next/head";

const Register: NextPage = () => {
  return (
    <>
      <Head>
        <title> Linconstore | Create a new account </title>
        <meta
          name="description"
          content="Find a wide range of products to cater for your everyday needs"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title="Linconstore | Buy and sell online with ease across Europe and North America"
        description="Shop a diverse range of products in several categories for your everyday use!"
      />
      <RegisterPage />
    </>
  );
};

export default Register;
