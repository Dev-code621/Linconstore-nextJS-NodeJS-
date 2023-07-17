import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack, Share, Visibility } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import Footer from "../Layouts/Footer";
import Nav from "../Layouts/Nav";

const Blog: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"How to sell on Linconstore"}
          description={"This is a blog page"}
          content={"how to sell on Linconstore"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}> Back </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography
                variant={isMobile ? "body1" : "h5"}
                textAlign={"center"}
              >
                {" "}
                <b> How to sell on Linconstore. </b>{" "}
              </Typography>
              <Typography variant={"body1"}>
                (1) Sign up for a seller account: To sign up for a seller
                account, you must meet the following requirements
              </Typography>
              <Container component={"article"}>
                <Typography variant={"body1"} sx={{ my: 2 }}>
                  You must be at least 18 years old.
                </Typography>
                <Typography variant={"body1"} sx={{ my: 2 }}>
                  You must reside in one of the following countries: Australia,
                  Austria, Belgium, Bulgaria, Canada, Croatia, Cyprus, Czech
                  Republic, Denmark, Estonia, Finland, France, Germany, Greece,
                  Hungary, Ireland, Italy, Lithuania, Luxembourg, Mexico,
                  Netherlands, New Zealand, Norway, Poland, Portugal, Spain,
                  Sweden, Switzerland, United Kingdom, United States.
                </Typography>
                <Typography variant={"body1"} sx={{ my: 2 }}>
                  You must have an active phone number.
                </Typography>
                <Typography variant={"body1"} sx={{ my: 2 }}>
                  You must have a bank account to receive your payouts. If you
                  don`t have a bank account, you can sign up for a service like
                  Revolut, Wise, Paysera, Vivid, or Rewire to get an account.
                </Typography>
                <Typography variant={"body1"} sx={{ my: 2 }}>
                  You must provide a verification document, which can be one of
                  the following: passport, driver`s license, government-issued
                  ID, government-issued license, EIN confirmation letter (US
                  only), tax-issued document, article of incorporation, or
                  business bank account statement.
                </Typography>
              </Container>
              <Typography variant={"body1"}>
                (2) Create a professional profile: Your seller profile is a key
                part of your online presence on Linconstore. Take the time to
                create a professional profile that includes information about
                your business and your products.
              </Typography>
              <Typography variant={"body1"}>
                (3) List your products: Once you have your seller account set
                up, it`s time to start listing your products. Be sure to include
                detailed descriptions, high-quality photos, and accurate pricing
                information for each item.
              </Typography>
              <Typography variant={"body1"}>
                (4)Promote your products: You`ll need to let people know that
                you`re there. Use social media and other marketing channels to
                promote your store and your products to potential buyers.
              </Typography>
              <Typography variant={"body1"}>
                (6) Provide excellent customer service: Providing excellent
                customer service is crucial to building a successful business on
                Linconstore. Respond promptly to customer inquiries and be sure
                to resolve any issues that may arise.
              </Typography>
              <Typography variant={"body1"}>
                By following these tips, you`ll be well on your way to success
                on Linconstore. Good luck with your sales!
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant={"h6"}>Related article </Typography>

              <Stack direction={"row"} spacing={2}>
                10 <Visibility className={"pointer"} />
                <Share className={"pointer"} />
              </Stack>
            </Box>
          </Box>
        </Wrapper>
      </Card>
      <Footer />
    </>
  );
};
export default Blog;
