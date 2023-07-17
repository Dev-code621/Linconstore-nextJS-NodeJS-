import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FavoriteBorder,
  LocalShippingOutlined,
  PolicyOutlined,
} from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IDetails {
  shipping: string;
  care: string;
}
const SimpleAccordion: React.FC<IDetails> = ({ shipping, care }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction={"row"} spacing={2}>
            <LocalShippingOutlined />
            <Typography>{t("product.accordion.shipping")}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{shipping}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack direction={"row"} spacing={2}>
            <PolicyOutlined />{" "}
            <Typography>{t("product.accordion.purchase")}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{t("product.accordion.purchase_content")}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack direction={"row"} spacing={2}>
            <FavoriteBorder />{" "}
            <Typography> {t("product.accordion.care")}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{care}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default SimpleAccordion;
