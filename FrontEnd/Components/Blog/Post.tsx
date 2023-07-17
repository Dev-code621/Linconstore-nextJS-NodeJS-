import React from "react";
import { Container } from "@mui/system";
import Box from "@mui/material/Box";
import { Card, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import Wrapper from "../Wappers/Container";
import BlogCard from "../Utils/BlogCards";
import Nav from "../Layouts/Nav";
import Footer from "../Layouts/Footer";

const Post: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  return (
    <>
      <Nav />
      <Card elevation={0} sx={{ borderRadius: "0px" }}>
        <Wrapper
          title={"Blog page | Linconstore"}
          description={"This is the blog page"}
          content={"This is the blog page about Linconstore"}
        >
          <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
            <Stack direction={"row"}>
              <ArrowBack
                onClick={() => router.push("/")}
                className={"pointer"}
              />
              <Typography variant={"body1"}> Home </Typography>
            </Stack>
            <Stack spacing={2}>
              <Container component={"article"} maxWidth={"lg"}>
                <Typography
                  variant={isMobile ? "body1" : "h1"}
                  textAlign={"center"}
                  sx={{ fontSize: "1.5rem", fontWeight: "600" }}
                >
                  <b> Blog Post</b>
                </Typography>

                <Grid container spacing={2} sx={{ my: 1 }}>
                  {[1].map((data, index) => (
                    <Grid key={index + data} item xs={12} sm={6} md={4}>
                      <BlogCard />
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
export default Post;
