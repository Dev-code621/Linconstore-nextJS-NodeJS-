import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import React from "react";

const Message = () => {
  return (
    <Box
      sx={{ border: "1px solid gray", my: 1, width: "100%" }}
      className={"pointer"}
    >
      <Stack
        sx={{
          p: 0.5,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography variant={"h6"}>John Napto</Typography>

        <Avatar variant={"circular"} sx={{ color: "white", bgcolor: "black" }}>
          +1
        </Avatar>
      </Stack>
    </Box>
  );
};
export default Message;
