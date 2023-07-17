import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack, Share, Visibility } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Message from "../Utils/Message";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";

const Messages: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper title={"Messages"} description={""} content={""}>
          <Box sx={{ display: "flex", flexDirection: "column", p: 1 }}>
            <Stack direction={"row"} alignItems={"center"}>
              <Stack direction={"row"} alignItems={"center"} gap={2}>
                <ArrowBack
                  onClick={() => router.back()}
                  className={"pointer"}
                />
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  fontSize={isMobile && "1rem"}
                  textAlign={"center"}
                >
                  {t("account.messages.title")}
                </Typography>
              </Stack>
            </Stack>
            <Container
              component={"article"}
              maxWidth={"md"}
              sx={{ m: isMobile ? "0 !important" : "4" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" textAlign={"center"}>
                  {t("account.messages.no_msg")}
                </Typography>
                {/* {[1, 2].map((data, index) => (
                  <Message key={index} />
                ))} */}
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Messages;
