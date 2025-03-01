import React from "react";
import Box from "@mui/material/Box";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";

const CancellationRefund: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"Cancellation, Refund, and Return Policy | Linconstore"}
          description={
            "Learn about Cancellation, Refund, and Return Policy when you purchase an item on Linconstore"
          }
          content={"Cancellation, Refund, and Return Policy | linconstore"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>
                {t("cancellationRefund.home")}
              </Typography>
            </Stack>
            <Typography
              variant={isMobile ? "h5" : "h1"}
              textAlign={"center"}
              sx={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              {t("cancellationRefund.title")}
            </Typography>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cancellationRefund.description1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.description2")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer1_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer1_2")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_3")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_4")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_5")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_6")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer2_7")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question3")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer3_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer3_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer3_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question4")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer4_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer4_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer4_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cancellationRefund.question5")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cancellationRefund.answer5_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer5_2")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cancellationRefund.answer5_3")}
              </Typography>
            </Stack>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default CancellationRefund;
