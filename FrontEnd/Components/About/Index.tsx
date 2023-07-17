import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";

const About: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"About us page | Linconstore"}
          description={"Learn about our values and core principles"}
          content={"Learn about linconstore values here"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>
                {t("about.ArrowBackTitle")}
              </Typography>
            </Stack>
            <Typography
              variant={isMobile ? "h5" : "h1"}
              textAlign={"center"}
              sx={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              {t("about.Title")}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid item container direction={"column"}>
                  <Grid item xs={6} sm={6}>
                    <Grid item container>
                      <Grid item xs={12} sm={7}>
                        <Typography variant={isMobile ? "h6" : "h6"}>
                          {t("about.SubTitle1")}
                        </Typography>
                        <Container component={"article"}>
                          <Typography variant={"body1"}>
                            {t("about.SubContent1")}
                          </Typography>
                        </Container>
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <Image
                          width={350}
                          height={250}
                          style={{
                            marginTop: 30,
                            width: "100%",
                            height: "100%",
                          }}
                          placeholder="blur"
                          blurDataURL={
                            "https://via.placeholder.com/300.png/09f/fff"
                          }
                          src={"/assets/img/Review-order.svg"}
                          alt={"image of review"}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid item container>
                      <Grid
                        item
                        xs={0}
                        sm={5}
                        sx={{ display: { xs: "none", sm: "flex" } }}
                      >
                        <Image
                          width={350}
                          height={250}
                          style={{
                            marginTop: 30,
                            width: "100%",
                            height: "100%",
                          }}
                          placeholder="blur"
                          blurDataURL={
                            "https://via.placeholder.com/300.png/09f/fff"
                          }
                          src={"/assets/img/Customer-care.svg"}
                          alt={"image of customer"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <Container component={"article"}>
                          <Typography variant={"body1"}>
                            {t("about.SubContent2")}
                          </Typography>
                        </Container>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={0}
                        sx={{ display: { xs: "flex", sm: "none" } }}
                      >
                        <Image
                          width={350}
                          height={250}
                          style={{
                            marginTop: 30,
                            width: "100%",
                            height: "100%",
                          }}
                          placeholder="blur"
                          blurDataURL={
                            "https://via.placeholder.com/300.png/09f/fff"
                          }
                          src={"/assets/img/Boxes.svg"}
                          alt={"image of Boxes"}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("about.SubTitle2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("about.SubContent3")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Image
                    width={350}
                    height={250}
                    style={{ marginTop: 30, width: "100%", height: "100%" }}
                    placeholder="blur"
                    blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                    src={"/assets/img/Chat.svg"}
                    alt={"image of chat"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: "200px",
                    }}
                  >
                    <Typography variant={"body1"}>
                      {t("about.SubContent4")}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default About;
