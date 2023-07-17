import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import {
  Card,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import GenNav from "../Layouts/GenNav";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";
import { useTranslation } from "react-i18next";

const Preferences: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      {isMobile ? <GenNav admin={false} mode={false} /> : <Nav />}
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"App preference"}
          description={"manage your preference "}
          content={"Manage your Preference"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack onClick={() => router.back()} className={"pointer"} />
              <Typography variant={"body1"}>
                {t("account.preference.back")}
              </Typography>
            </Stack>
            <Container component={"article"} maxWidth={"lg"}>
              <Box sx={{ p: 1, maxWidth: 600 }}>
                <Typography variant={isMobile ? "body1" : "h5"}>
                  {t("account.preference.title")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    justifyContent: "center",
                  }}
                >
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      p: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {" "}
                      {t("account.preference.item1")}{" "}
                    </Typography>
                    <Switch />
                  </Stack>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      p: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {" "}
                      {t("account.preference.item2")}{" "}
                    </Typography>
                    <Switch />
                  </Stack>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      p: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {" "}
                      {t("account.preference.item3")}{" "}
                    </Typography>
                    <Switch />
                  </Stack>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      p: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant={isMobile ? "body1" : "h6"}>
                      {" "}
                      {t("account.preference.item4")}{" "}
                    </Typography>
                    <Switch />
                  </Stack>
                </Box>
              </Box>
            </Container>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Preferences;
