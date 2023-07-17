import React, { ChangeEvent, useCallback } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { FormHelperText, IconButton, Stack, Typography } from "@mui/material";
import {
  AttachmentOutlined,
  HighlightOffOutlined,
  SendOutlined,
} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object().shape({
  message: yup.string().required().min(4),
  attachment: yup
    .mixed()
    .test("fileSize", "File Size is too large", (value) => {
      if (value) {
        return value.size <= 2000000;
      } else {
        return true;
      }
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (value) {
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
      return true;
    }),
});
type Chat = {
  message: string;
  attachment: File | null;
};
const Chat: React.FC = () => {
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Chat>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      message: "",
      attachment: null,
    },
  });
  const onSubmit: SubmitHandler<Chat> = useCallback((data) => {
  }, []);
  return (
    <Container maxWidth={"lg"}>
      <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            p: 2,
            borderTopLeftRadius: "8px",
            color: "#fff",
            borderTopRightRadius: "8px",
            backgroundColor: "#54991D",
            justifyContent: "space-between",
          }}
        >
          <Stack>
            <Typography gutterBottom variant={"body2"}>
              Store Name
            </Typography>
            <Typography gutterBottom variant={"h6"}>
              Item Name
            </Typography>
            <Typography gutterBottom variant={"body2"}>
              Brand/Item specifics
            </Typography>
          </Stack>
          <HighlightOffOutlined className={"pointer"} />
        </Box>
        <Box className="msger-chat">
          <div className="msg left-msg">
            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-name">Jack smith</div>
                <div className="msg-info-time">12:45</div>
              </div>

              <div className="msg-text">
                Testing Lorem ipsum dolor sit amet, consectetur adipisicing
                elit. Architecto distinctio illum maxime, neque perspiciatis
                quas quasi repellendus suscipit unde velit. 😄
              </div>
            </div>
          </div>

          <div className="msg right-msg">
            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-name">John Doe</div>
                <div className="msg-info-time">12:46</div>
              </div>

              <div className="msg-text">
                Hi, my name is lorem ipsum dolor sit amet, consectetur
                adipisicing elit.
              </div>
            </div>
          </div>
          <div className="msg left-msg">
            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-name">Jack smith</div>
                <div className="msg-info-time">12:45</div>
              </div>

              <div className="msg-text">
                Testing Lorem ipsum dolor sit amet, consectetur adipisicing
                elit. Architecto distinctio illum maxime, neque perspiciatis
                quas quasi repellendus suscipit unde velit. 😄
              </div>
            </div>
          </div>
          <div className="msg right-msg">
            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-name">John Doe</div>
                <div className="msg-info-time">12:46</div>
              </div>

              <div className="msg-text">
                Hi there, thanks for getting in touch.
              </div>
            </div>
          </div>
        </Box>

        <Box
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FormHelperText sx={{ color: "red" }}>
            {errors?.attachment?.message}
          </FormHelperText>
          <Box sx={{ display: "flex" }}>
            <Controller
              name="attachment"
              control={control}
              render={({ field: { onChange }, formState: { errors } }) => (
                <IconButton
                  color="primary"
                  aria-label="attachment"
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setValue(
                        "attachment",
                        e.target.files && e.target.files[0]
                      );
                    }}
                  />
                  <AttachmentOutlined color={"success"} />
                </IconButton>
              )}
            />
            <Controller
              name="message"
              control={control}
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => (
                <TextField
                  id="outlined-multiline-flexible"
                  fullWidth
                  size={"small"}
                  sx={{
                    minHeight: 45,
                    border: "2px solid #54991D",
                    borderRadius: "29px",
                    "& fieldset": {
                      border: "none !important",
                      outline: "none !important",
                    },
                  }}
                  InputLabelProps={{
                    style: { color: "#54991D", marginTop: 3 },
                  }}
                  multiline
                  onChange={onChange}
                  value={value}
                  error={!!errors?.message}
                  helperText={errors?.message?.message}
                  variant={"outlined"}
                  required
                  maxRows={4}
                />
              )}
            />
            <IconButton
              type={"submit"}
              color="success"
              aria-label="message seller"
            >
              {/*<FontAwesomeIcon style={{color: '#54991D'}} icon={faComment}/>*/}
              <SendOutlined />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
export default Chat;
