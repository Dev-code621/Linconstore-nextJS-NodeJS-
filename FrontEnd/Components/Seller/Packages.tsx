import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PackageCard from "../Utils/PackageCard";
import * as React from "react";
import Logo from "../Utils/Logo";
import { useTranslation } from "react-i18next";

const Packages: React.JSXElementConstructor<any> = () => {
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant={"h5"} sx={{ textAlign: "center" }}>
          {t("seller.setup.title")}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <PackageCard type={"BasicMonthly"} />
      </Box>
    </>
  );
};
export default Packages;
