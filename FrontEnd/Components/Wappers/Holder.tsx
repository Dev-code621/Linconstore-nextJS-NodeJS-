import React from "react";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import GenNav from "../Layouts/GenNav";

interface Holder {
  children: any;
  title: string;
}
const Holder: React.JSXElementConstructor<any> = (props: Holder) => {
  const { title, children } = props;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Please Sign ${
            title === "Register" ? "Up" : "In"
          } to make a Complaint`}
        />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <GenNav admin={false} mode={false} />
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // height: 600,
            // justifyContent: 'center'
          }}
        >
          {children}
        </Box>
      </Container>
    </>
  );
};

export default Holder;
