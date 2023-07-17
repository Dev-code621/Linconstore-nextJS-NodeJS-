import React, { useState } from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Search from "../Utils/Search";
import FAQAccordion from "../Utils/FAQAccordion";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";

const FAQ: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"FAQ page of Linconstore"}
          description={"This is when you find frequently asked questions"}
          content={"See frequently asked questions"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>{t("faq.home")}</Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography
                variant={isMobile ? "h6" : "h1"}
                textAlign={"center"}
                sx={{ fontSize: "1.5rem", fontWeight: "600" }}
              >
                <b>{t("faq.title")}</b>
              </Typography>
              <Container maxWidth={"xl"} component={"article"}>
                <Container maxWidth={"md"}>
                  <Search search={search} handleChange={handleChange} />
                </Container>
                <Grid container spacing={2}>
                  {[1].map((item, index) => (
                    <Grid item xs={12} key={index + item}>
                      <FAQAccordion
                        question={t("faq.data.ques1")}
                        answer={t("faq.data.ans1")}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Stack>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default FAQ;
