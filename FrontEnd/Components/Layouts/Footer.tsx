import {
  CssBaseline,
  Grid,
  IconButton,
  Paper,
  Stack,
  createTheme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { FiberManualRecordOutlined } from "@mui/icons-material";
import Image from "next/image";
import ContextApi from "../../Store/context/ContextApi";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import { getCurrentYear } from "../../Helpers/getDate";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Flag from "react-world-flags";
import { css } from '@emotion/react';

const gridItemStyles = css`
  width: 7%; /* Initial width: 7 */

  @media (max-width: 600px) {
    width: 100%; /* Width: 100 */
  }
`;

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
const Footer: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobileFooter: boolean = useMediaQuery("(max-width : 400px)");
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const router = useRouter();
  const role = useContext(ContextApi).role;
  const { i18n, t } = useTranslation();
  const handleRoute = () => {
    if (!isLoggedIn) return router.push("/login");
    const isCompleted = localStorage.getItem("completed");
    if (isCompleted) return;
    if (role === "seller") {
      return router.push("/seller/verify");
    }
    router.push("/seller/verify");
  };
  const handleRouter = (url: string) => {
    window.open(url, "_blank");
  };
  const handleChangLang = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  const languages = [
    {
      value: "English",
      label: t("lang.English"),
      code: "GB",
    },
    {
      value: "French",
      label: t("lang.French"),
      code: "FR",
    },
    {
      value: "Spanish",
      label: t("lang.Spanish"),
      code: "ES",
    },
    {
      value: "Dutch",
      label: t("lang.Dutch"),
      code: "NL",
    },
    {
      value: "Turkish",
      label: t("lang.Turkish"),
      code: "TR",
    },
    {
      value: "Greek",
      label: t("lang.Greek"),
      code: "GR",
    },
    {
      value: "Swedish",
      label: t("lang.Swedish"),
      code: "SE",
    },
    {
      value: "Polish",
      label: t("lang.Polish"),
      code: "PL",
    },
    {
      value: "Portuguese",
      label: t("lang.Portuguese"),
      code: "PT",
    },
    {
      value: "Italian",
      label: t("lang.Italian"),
      code: "IT",
    },
    {
      value: "Norwegian",
      label: t("lang.Norwegian"),
      code: "NO",
    },
    {
      value: "Czech",
      label: t("lang.Czech"),
      code: "CZ",
    },
  ];


  return (
    <Paper sx={{ background: "#606264", p: 3, color: "#ffffff" }} className="footerMain">
      <Container maxWidth="xl" component={"main"}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            m: { xs: isMobileFooter ? 0 : 1, sm: 2, md: 3, lg: 5, xl: 6 },
            flexDirection: "row",
            mb: 2,
            justifyContent: "space-around",
          }}
        >
          <Grid container>
            <Grid item xs={isMobile ? 12 : 7} sm={6} md={2.3}>
              <Image
                src="/assets/img/bothword-store.png"
                placeholder="blur"
                blurDataURL={"https://via.placeholder.com/300.png/09f/fff"}
                className="footer_logo"
                priority={true}
                width={isMobile ? 100 : 120}
                height={isMobile ? 75 : 95}
                alt={"pictures on footer"}
              />
              <Stack spacing={1}>
                <Typography sx={{ color: "#AEB4BE" }} variant="body2">
                  {t("footer.CompanyNo")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item className="gridItemStyles" sm={6} md={2.3}>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ color: "#ffffff" }}>
                  {t("footer.CompanyTitle")}
                </Typography>
                <Typography sx={{ color: "#AEB4BE" }} variant="body2">
                  <Link href={"about"}>
                    <a href={"about"}>{t("footer.CompanyAbout")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ color: "#AEB4BE", mb: 3 }} variant="body2">
                  <Link href={"blog"}>
                    <a href={"blog"}>{t("footer.CompanyBlog")}</a>
                  </Link>
                </Typography>
                <Box sx={{ m: 3 }} >
                  <Stack
                    direction={"row"}
                    sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                  >
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleRouter(
                          "https://twitter.com/linconstore?t=cY9nfR0DBzQF3KEyCGp4wg&s=09"
                        )
                      }
                    >
                      <Avatar
                        variant={"circular"}
                        sx={{ width: "20px", height: "20px" }}
                        className={"social"}
                        src={"/assets/img/social/twitter.png"}
                        alt={"icon of twitter"}
                      />
                    </IconButton>
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleRouter("https://instagram.com/linconstoreltd")
                      }
                    >
                      <Avatar
                        variant={"circular"}
                        sx={{ width: "20px", height: "20px" }}
                        className={"social"}
                        src={"/assets/img/social/instagram.png"}
                        alt={"icon of instagram"}
                      />
                    </IconButton>
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleRouter("https://facebook.com/linconstore")
                      }
                    >
                      <Avatar
                        variant={"circular"}
                        sx={{ width: "20px", height: "20px" }}
                        className={"social"}
                        src={"/assets/img/social/facebook.png"}
                        alt={"icon of facebook"}
                      />
                    </IconButton>
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleRouter("https://youtube.com/@linconstore")
                      }
                    >
                      <Avatar
                        variant={"circular"}
                        sx={{ width: "20px", height: "20px" }}
                        className={"social"}
                        src={"/assets/img/social/youtube.png"}
                        alt={"icon of youtube"}
                      />
                    </IconButton>
                    <IconButton
                      size={"small"}
                      onClick={() =>
                        handleRouter("https://linkedin.com/company/linconstore")
                      }
                    >
                      <Avatar
                        variant={"circular"}
                        sx={{ width: "20px", height: "20px" }}
                        className={"social"}
                        src={"/assets/img/social/linkedin.png"}
                        alt={"icon of linkedin"}
                      />
                    </IconButton>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={isMobile ? 12 : 6} sm={6} md={2.3}>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ color: "#ffffff" }}>
                  {t("footer.OpportunityTitle")}
                </Typography>
                <Typography
                  onClick={handleRoute}
                  sx={{ color: "#AEB4BE", cursor: "pointer" }}
                  variant="body2"
                >
                  {t("footer.Sell")}
                </Typography>
                <Typography sx={{ color: "#AEB4BE" }} variant="body2">
                  <Link href="work">
                    <a href={"work"}>{t("footer.WorkUs")}</a>
                  </Link>
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={isMobile ? 12 : 6} sm={6} md={2.3}>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ color: "#ffffff" }}>
                  {t("footer.HelpCenter")}
                </Typography>
                <Typography sx={{ color: "#AEB4BE" }} variant="body2">
                  <Link href={"contact"}>
                    <a href={"contact"}>{t("footer.ContactUs")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ color: "#AEB4BE" }} variant="body2">
                  <Link href={"faq"}>
                    <a href={"faq"}>{t("footer.FAQS")}</a>
                  </Link>
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={isMobile ? 12 : 6} sm={6} md={2.3}>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ color: "#ffffff" }}>
                  {t("footer.OtherLinks")}
                </Typography>
                <Typography sx={{ color: "#AEB4BE" }} variant="body2">
                  <Link href={"buyer-protection"}>
                    <a href={"buyer-protection"}>{t("footer.Buyer")}</a>
                  </Link>
                </Typography>
                <Typography sx={{ color: "#AEB4BE" }} variant="body2">
                  <Link href={"cancellation-refund"}>
                    <a href={"cancellation-refund"}>{t("footer.Refund")}</a>
                  </Link>
                </Typography>
                {!isMobile && (
                  <TextField
                    id="outlined-select-currency"
                    select
                    defaultValue={
                      i18n.language.includes("en") ? "English" : i18n.language
                    }
                    key={i18n.language}
                    onChange={(e) => handleChangLang(e)}
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      width: "fit-content",
                    }}
                    variant="standard"
                  >
                    {languages.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <ListItemIcon sx={{ maxHeight: "20px" }}>
                            <Flag code={option.code}></Flag>
                          </ListItemIcon>
                          <ListItemText sx={{ ml: 1 }}>
                            <b>{option.label}</b>
                          </ListItemText>
                        </div>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                {isMobile && (
                  <TextField
                    id="outlined-select-currency"
                    select
                    defaultValue={
                      i18n.language.includes("en") ? "English" : i18n.language
                    }
                    key={i18n.language}
                    onChange={(e) => handleChangLang(e)}
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 1,
                      width: "fit-content",
                    }}
                    variant="standard"
                    SelectProps={{
                      MenuProps: {
                        sx: { top: "-180px", maxHeight: "250px" },
                      },
                    }}
                  >
                    {languages.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <ListItemIcon sx={{ maxHeight: "20px" }}>
                            <Flag code={option.code}></Flag>
                          </ListItemIcon>
                          <ListItemText sx={{ ml: 1 }}>
                            <b>{option.label}</b>
                          </ListItemText>
                        </div>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            display: "flex",
            m: { xs: isMobileFooter ? 0 : 1, sm: 2, md: 3, lg: 5, xl: 6 },
            flexDirection: isMobileFooter ? "column" : "row",
            justifyContent: "space-between",
            marginBottom: "0px !important",
          }}
        >
          <Typography variant="caption">
            <Link href={"privacy"}>
              <a href={"privacy"}>{t("footer.Privacy")}</a>
            </Link>
          </Typography>
          {!isMobile && <FiberManualRecordOutlined fontSize={"small"} />}
          <Typography variant="caption">
            <Link href={"cookie"}>
              <a href={"cookie"}>{t("footer.Cookie")}</a>
            </Link>
          </Typography>
          {!isMobile && <FiberManualRecordOutlined fontSize={"small"} />}
          <Typography variant="caption">
            <Link href={"terms"}>
              <a href={"terms"}>{t("footer.Terms")}</a>
            </Link>
          </Typography>
        </Box>
        <Box
          sx={{
            m: { xs: isMobileFooter ? 0 : 1, sm: 2, md: 3, lg: 5, xl: 6 },
            marginTop: "0px !important",
          }}
        >
          <Typography variant="subtitle2" mt={1}>
            &copy; {getCurrentYear()} Linconstore Ltd.
          </Typography>
        </Box>
      </Container>
      {/* <Divider sx={{ mt: 2 }} />
      <Container component={"main"}>
        <Box
          sx={{
            color: "#AEB4BE",
            display: "flex",
            mt: isMobileFooter ? 2 : 1,
            flexDirection: isMobileFooter ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption">
            <Link href={"privacy"}>
              <a href={"privacy"}>{t("footer.Privacy")}</a>
            </Link>
          </Typography>
          {!isMobile && <FiberManualRecordOutlined fontSize={"small"} />}
          <Typography variant="caption">
            <Link href={"cookie"}>
              <a href={"cookie"}>{t("footer.Cookie")}</a>
            </Link>
          </Typography>
          {!isMobile && <FiberManualRecordOutlined fontSize={"small"} />}
          <Typography variant="caption">
            <Link href={"terms"}>
              <a href={"terms"}>{t("footer.Terms")}</a>
            </Link>
          </Typography>
        </Box>
        <Typography variant="subtitle2" mt={1}>
          &copy; {getCurrentYear()} Linconstore Ltd.
        </Typography>
      </Container> */}
    </Paper>
  );
};
export default Footer;
