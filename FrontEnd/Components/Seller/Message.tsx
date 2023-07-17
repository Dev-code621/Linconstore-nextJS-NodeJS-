import React from "react";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Head from "next/head";

const Message: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Messages | seller dashboard linconstore</title>
        <meta name={"Messages"} content={"These are Messages"} />
        <link rel="icon" href="/favicon-store.ico" />
      </Head>
      <Card elevation={0} sx={{ background: "#f3f2f2", mt: 1, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
          <Typography variant={"h6"}>{t("seller.messages.title")}</Typography>
        </Box>
        <Box>
          <Typography variant={"body1"} mt={3}>
            No messages
          </Typography>
        </Box>
        {/* <Box sx={{ border: "2px solid black", my: 1 }}>
        <Stack
          sx={{
            border: "1px solid black",
            p: 0.5,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant={"h6"}>John Napto</Typography>

          <Avatar
            variant={"circular"}
            sx={{ color: "white", bgcolor: "black" }}
          >
            +1
          </Avatar>
        </Stack>
      </Box> */}
      </Card>
    </>
  );
};
export default Message;
