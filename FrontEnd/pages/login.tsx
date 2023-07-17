import { NextPage } from "next";
import LoginPage from "../Components/Auth/Login";
import { NextSeo } from "next-seo";
import Head from "next/head";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Linconstore | Sign into your account</title>
        <meta
          name="description"
          content="Find a wide range of products to cater for your everyday needs"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title="Linconstore | Buy and sell online with ease across Europe and North America"
        description="Shop a diverse range of products in different categories for your everyday use!"
      />
      <LoginPage />
    </>
  );
};

export default Login;
