import { NextPage } from "next";
import Work from "../../Components/Work/Index";
import { NextSeo } from "next-seo";
import Head from "next/head";

const WorkPage: NextPage = () => {
  return (
    <>
      <Head>
        <title> Linconstore | Career Opportunities </title>
        <meta
          name="description"
          content="Find a wide range of products to cater for your everyday needs"
        />
        <link rel="icon" href="/favicon-store.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <NextSeo
        title="Linconstore | Work with Linconstore"
        description="Join the team at Linconstore"
      />
      <Work />
    </>
  );
};
export default WorkPage;
