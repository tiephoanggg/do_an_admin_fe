"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem as MuiMenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Image from "next/image";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import logo from "public/img/Logomark.png";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ValueLoginForm } from "./constants";
import { get, includes, isEmpty, remove } from "lodash";
import LoadingButton from "@mui/lab/LoadingButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useStyles } from "./style";

import { useBoolean, useToggle } from "ahooks";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { message } from "antd";
interface Values {
  email: string;
  password: string;
}
function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [visiblePassword, { toggle: togglePassword }] = useToggle();

  const [messageApi, contextHolder] = message.useMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {},
    mode: "onSubmit",
  });

  const handleLogin = async (data: any) => {
    try {
      const { data: res } = await axios.post(
        "http://localhost:4000/v4/user/login",
        data
      );
      console.log(res);
      if (res.token) {
        messageApi.open({
          type: "success",
          content: "Đăng nhập thành công",
        });
        Cookies.set("accessToken", res.token, { expires: 1 / 8 });
        Cookies.set("fullName", res.fullName, { expires: 1 / 8 });
        Cookies.set("email", res.email, { expires: 1 / 8 });
        Cookies.set("phoneNumber", res.phoneNumber, { expires: 1 / 8 });
        Cookies.set("id", res._id, { expires: 1 / 8 });
        Cookies.set("address", res.address, { expires: 1 / 8 });
        Cookies.set("role", res.role, { expires: 1 / 8 });
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: "Email hoặc mật khẩu không đúng",
      });
    }
  };
  const onSubmit = (values: Values) => {
    console.log(values);
    handleLogin(values);
  };
  return (
    <Box bgcolor="#FFD4DE">
      {contextHolder}
      <Grid container columns={18} py="40px" px="110px" alignItems="center">
        <Grid item xs={18}>
          <Link href={"/"}>
            <Box display="flex" flexDirection="row">
              <Image src={logo} alt="" />
              <Typography
                sx={{
                  fontWeight: 500,
                  marginBottom: "2px",
                  fontSize: "40px",
                  color: "#fff",
                }}
              >
                Cavila Store{" "}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 500,
                  marginBottom: "2px",
                  fontSize: "20px",
                  color: "#0668FB",
                  pt: "20px",
                }}
              >
                Admin
              </Typography>
            </Box>
          </Link>
        </Grid>
      </Grid>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        pt="180px"
        pb="220px"
        my="0px"
      >
        {" "}
        <Typography
          sx={{
            fontWeight: 600,
            marginBottom: "2px",
            fontSize: "48px",
            color: "#fff",
          }}
        >
          Đăng nhập
        </Typography>
        <Box sx={{ width: "400px", my: "20px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Email không được bỏ trống",
                },
              }}
              name="email"
              render={({ field }) => (
                <Box my="15px">
                  <OutlinedInput
                    {...field}
                    sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                    id="email"
                    placeholder="Email"
                    error={!isEmpty(errors.email)}
                    autoComplete="off"
                    className={classes.input}
                    fullWidth
                  />
                  {!isEmpty(errors.email) && (
                    <Typography fontSize={12} color="#ff0000" my="5px">
                      {get(errors, "email.message", "")}
                    </Typography>
                  )}
                </Box>
              )}
            />
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Mật khẩu không được bỏ trống",
                },
              }}
              name="password"
              render={({ field }) => (
                <Box my="15px">
                  <OutlinedInput
                    {...field}
                    id="password"
                    sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                    placeholder="Mật khẩu"
                    error={!isEmpty(errors.password)}
                    autoComplete="off"
                    type={visiblePassword ? "text" : "password"}
                    className={classes.input}
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePassword}
                        >
                          {!visiblePassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {!isEmpty(errors.password) && (
                    <Typography fontSize={12} color="#ff0000" my="5px">
                      {get(errors, "password.message", "")}
                    </Typography>
                  )}
                </Box>
              )}
            />
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <LoadingButton
                type="submit"
                sx={{ backgroundColor: "#FF3366", my: "10px" }}
                variant="contained"
                className={classes.btn}
              >
                Đăng nhập
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
