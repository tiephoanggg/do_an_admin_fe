"use client";
import MenuPage from "@/components/menu/menu";
import {
  Box,
  InputLabel,
  OutlinedInput,
  Typography,
  Grid,
  Select,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import { LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { get, includes, isEmpty, remove, values } from "lodash";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useStyles } from "./style";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";

interface Values {
  name: string;
  code: string;
  discountPrice: number;
  priceUsed: number;
  quantity: number;
}

export default function AddVoucher() {
  const classes = useStyles();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: {},
    mode: "onSubmit",
  });
  const router = useRouter();
  const storedToken = Cookies.get("accessToken");
  useEffect(() => {
    if (!storedToken) {
      router.push("/Login");
    }
  }, []);

  const HandleAddVoucher = async (data: any) => {
    try {
      const { data: res } = await axios.post(
        "http://localhost:4000/v4/voucher/createVoucher",
        data,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      console.log(res);
      alert("Thêm voucher thành công");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmit = (values: Values) => {
    const payload = {
      name: values.name,
      code: values.name,
      discountPrice: Number(values.discountPrice),

      quantity: Number(values.quantity),
    };
    HandleAddVoucher(payload);
  };
  const handleLogout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("fullName");
    Cookies.remove("email");
    Cookies.remove("addres");
    Cookies.remove("fullName");
    Cookies.remove("id");
    Cookies.remove("role");
    router.push("/Login");
  };
  return (
    <Box display="flex" flexDirection="row" bgcolor="#FFD4DE">
      <MenuPage />
      <Box px="80px" display="flex" flexDirection="column" width="1580px">
        <Box display="flex" justifyContent="flex-end" mt="40px">
          <LogoutOutlined
            onClick={handleLogout}
            style={{ fontSize: "26px", color: "#000000" }}
          />
        </Box>
        <Box>
          <Typography
            sx={{ fontWeight: 500, fontSize: "48px", color: "#000000" }}
          >
            Thêm voucher
          </Typography>
        </Box>
        <Grid container columns={10}>
          <Grid item xs={10}>
            <Box className={classes.form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Tên không được bỏ trống",
                    },
                  }}
                  name="name"
                  render={({ field }) => (
                    <Box my="15px">
                      <InputLabel
                        sx={{ color: "#000000", mb: "5px", fontWeight: "600" }}
                        htmlFor="name"
                      >
                        Tên voucher
                      </InputLabel>
                      <OutlinedInput
                        {...field}
                        sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                        id="name"
                        placeholder="Tên voucher"
                        error={!isEmpty(errors.name)}
                        autoComplete="off"
                        className={classes.input}
                        fullWidth
                      />
                      {!isEmpty(errors.name) && (
                        <Typography fontSize={12} color="#ff0000" my="5px">
                          {get(errors, "name.message", "")}
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
                      message: "Code voucher không được bỏ trống",
                    },
                  }}
                  name="code"
                  render={({ field }) => (
                    <Box my="15px">
                      <InputLabel
                        sx={{ color: "#000000", mb: "5px", fontWeight: "600" }}
                        htmlFor="code"
                      >
                        Code voucher
                      </InputLabel>
                      <OutlinedInput
                        {...field}
                        sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                        id="code"
                        placeholder="Code voucher"
                        error={!isEmpty(errors.code)}
                        autoComplete="off"
                        className={classes.input}
                        fullWidth
                      />
                      {!isEmpty(errors.code) && (
                        <Typography fontSize={12} color="#ff0000" my="5px">
                          {get(errors, "code.message", "")}
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
                      message: "Số lượng không được bỏ trống",
                    },
                  }}
                  name="quantity"
                  render={({ field }) => (
                    <Box my="15px">
                      <InputLabel
                        sx={{ color: "#000000", mb: "5px", fontWeight: "600" }}
                        htmlFor="quantity"
                      >
                        Số lượng voucher
                      </InputLabel>
                      <OutlinedInput
                        {...field}
                        sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                        id="quantity"
                        placeholder="số lượng voucher"
                        error={!isEmpty(errors.quantity)}
                        autoComplete="off"
                        className={classes.input}
                        fullWidth
                      />
                      {!isEmpty(errors.quantity) && (
                        <Typography fontSize={12} color="#ff0000" my="5px">
                          {get(errors, "quantity.message", "")}
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
                      message: "Giá trị không được bỏ trống",
                    },
                  }}
                  name="discountPrice"
                  render={({ field }) => (
                    <Box my="15px">
                      <InputLabel
                        sx={{ color: "#000000", mb: "5px", fontWeight: "600" }}
                        htmlFor="discountPrice"
                      >
                        Giá trị voucher
                      </InputLabel>
                      <OutlinedInput
                        {...field}
                        sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                        id="discountPrice"
                        placeholder="Giá sản phẩm"
                        error={!isEmpty(errors.discountPrice)}
                        autoComplete="off"
                        className={classes.input}
                        fullWidth
                      />
                      {!isEmpty(errors.discountPrice) && (
                        <Typography fontSize={12} color="#ff0000" my="5px">
                          {get(errors, "discountPrice.message", "")}
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
                    Lưu voucher
                  </LoadingButton>
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
