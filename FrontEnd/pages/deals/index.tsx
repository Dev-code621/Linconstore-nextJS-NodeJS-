import { NextPage } from "next";
import Deals from "../../Components/Deals/Hotdeals";
import { NextSeo } from "next-seo";
import Head from "next/head";

const HotDeals: NextPage = () => {
  return (
    <>
      <Head>
        <title>Linconstore | Find discounted products here </title>
        <meta
          name="description"
          content="Find a wide range of discounted products"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title="Linconstore | buy and sell online with ease"
        description="Shop a wide range of discounted deals here "
      />
      <Deals />
    </>
  );
};

export default HotDeals;
