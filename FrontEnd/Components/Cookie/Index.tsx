import React from "react";
import Box from "@mui/material/Box";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Nav from "../Layouts/Nav";
import { useTranslation } from "react-i18next";

const Cookie: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"Cookie policy page | Linconstore"}
          description={"Learn what cookies we use when you visit linconstore"}
          content={"cookie policy page | linconstore"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}>
                {t("cookie_policy.home")}
              </Typography>
            </Stack>
            <Typography
              variant={isMobile ? "h5" : "h1"}
              textAlign={"center"}
              sx={{ fontSize: "1.5rem", fontWeight: "600" }}
            >
              {t("cookie_policy.title")}
            </Typography>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cookie_policy.content")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cookie_policy.ques1")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cookie_policy.ans1")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cookie_policy.ques2")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cookie_policy.ans2_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans2_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans2_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={isMobile ? "h6" : "h6"}>
                {t("cookie_policy.ques3")}
              </Typography>

              <Typography variant={"body1"}>
                {t("cookie_policy.ans3_1")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans3_2")}
              </Typography>
              <Typography variant={"body1"}>
                {t("cookie_policy.ans3_3")}
              </Typography>
            </Stack>

            <Stack spacing={2} sx={{ my: 1 }}>
              <Typography variant={"body1"}>
                {t("cookie_policy.date")}
              </Typography>
            </Stack>
          </Box>
        </Wrapper>
      </Card>
    </>
  );
};
export default Cookie;
