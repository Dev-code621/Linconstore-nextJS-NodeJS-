import React from "react";
import Box from "@mui/material/Box";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";

const BuyerProtection: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"Buyers Protection page | Linconstore"}
          description={"Learn about how your purchases are protected on Linconstore"}
          content={"buyers protection for linconstore"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>
                {t("buyerProtection.home")}
              </Typography>
            </Stack>
            <Typography
              variant={isMobile ? "h5" : "h1"}
              textAlign={"center"}
              sx={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              {t("buyerProtection.title")}
            </Typography>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("buyerProtection.description1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.description2")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question1")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer1")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("buyerProtection.question2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer2")}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question3")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question4")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer4")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question5")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer5")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.question6")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.answer6")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {" "}
                {t("buyerProtection.noteTitle")}{" "}
              </Typography>

              <Typography variant={"body1"}>
                {t("buyerProtection.note1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("buyerProtection.note2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("buyerProtection.note3")}
              </Typography>
              <Typography variant={"body1"}>
                {t("buyerProtection.note4")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("buyerProtection.datePost")}
              </Typography>
            </Stack>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default BuyerProtection;
