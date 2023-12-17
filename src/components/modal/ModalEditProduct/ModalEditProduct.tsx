import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Backdrop,
  Box,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Typography,
  Select,
  MenuItem as MuiMenuItem,
} from "@mui/material";

import { ValueEditProductForm } from "./constants";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Controller, useForm, useWatch } from "react-hook-form";
import { get, includes, isEmpty, remove } from "lodash";
import { useStyles } from "./constants";
import { useToggle } from "ahooks";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import LoadingButton from "@mui/lab/LoadingButton";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import useChangeData from "@/Hooks/useChangeData";
export interface ModalEditProductProps {
  visible: boolean;
  onClose?: () => void;
  data: any;
}

interface Values {
  name: string;
  category: string;
  description: string;
  quantity: number;
  sizes: string;
  colors: string;
  price: string;
  image: string;
  gender: string;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function ModalEditProduct({ visible, onClose, data }: ModalEditProductProps) {
  const classes = useStyles();
  const storedToken = Cookies.get("accessToken");
  const fullNameDefau = Cookies.get("fullName");
  const emailDefau = Cookies.get("email");
  const phoneNumberDefau = Cookies.get("phoneNumber");
  const addressDefau = Cookies.get("address");
  const [open, setOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [img, setImg] = useState<string>("");
  const [disabled, setDisabled] = useState(true);
  const listSize = ["S", "M", "L", "XL", "2XL", "3XL"];
  const listColor = [
    "Blue",
    "Red",
    "White",
    "Yellow",
    "Orange",
    "Green",
    "Pink",
    "Black",
  ];
  console.log(data);
  const listGender = ["M", "L"];
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
  } = useForm<ValueEditProductForm>({
    mode: "all",
    defaultValues: {},
  });

  useEffect(() => {
    setOpen(visible);
    if (!visible) {
      reset();
    }
  }, [visible]);

  const handChangSize = (size: string) => {
    // Xử lý khi checkbox thay đổi trạng thái
    if (selectedSizes.includes(size)) {
      // Nếu size đã được chọn, loại bỏ nó khỏi mảng selectedSizes
      setSelectedSizes((prevSelectedSizes) =>
        prevSelectedSizes.filter((s) => s !== size)
      );
    } else {
      // Nếu size chưa được chọn, thêm nó vào mảng selectedSizes
      setSelectedSizes((prevSelectedSizes) => [...prevSelectedSizes, size]);
    }
  };
  const handChangColor = (size: string) => {
    // Xử lý khi checkbox thay đổi trạng thái
    if (selectedColors.includes(size)) {
      // Nếu size đã được chọn, loại bỏ nó khỏi mảng selectedSizes
      setSelectedColors((prevSelectedColors) =>
        prevSelectedColors.filter((s) => s !== size)
      );
    } else {
      // Nếu size chưa được chọn, thêm nó vào mảng selectedSizes
      setSelectedColors((prevSelectedColors) => [...prevSelectedColors, size]);
    }
  };
  useChangeData({
    control,
    deps: data,
    cb: () => setDisabled(false),
    reset: () => setDisabled(true),
  });
  const serviceType = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    if (!!data && !isEmpty(data)) {
      reset({
        name: data.name,
        category: data.category,
        description: data.description,
        quantity: data.quantity,

        price: data.price,
        image: data.image,
        gender: data.gender,
      });
      setSelectedSizes(data.size);
      setSelectedColors(data.color);
      setImg(data.images[0]);
    }
  }, [data]);
  const handleGetPicture = async (data: any) => {
    let formData = new FormData();
    formData.append("file", data);
    try {
      const { data: res } = await axios.post(
        "http://localhost:4000/v4/upload",
        formData,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      console.log(res);
      setImg(res);
    } catch (error) {
      console.error(error);
    }
  };
  const onChangePicture = (e: any) => {
    console.log(e);
    handleGetPicture(e.target.files[0]);
  };

  const handleEditProduct = async (data: any, id: any) => {
    try {
      const { data: res } = await axios.put(
        `http://localhost:4000/v4/product/${id}/updateProduct`,
        data,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      console.log(res);
      alert("Sửa sản phẩm thành công");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmit = (values: Values) => {
    console.log(values);
    const payload = {
      name: values.name,
      category: values.category,
      gender: values.gender,
      description: values.description,
      quantity: Number(values.quantity),
      price: Number(values.price),
      sizes: selectedSizes,
      colors: selectedColors,
      images: img,
    };
    const payloadTest = {
      name: values.name,
      category: values.category,
      gender: values.gender,
      description: values.description,
      quantity: Number(values.quantity),
      price: values.price,
      sizes: selectedSizes,
      colors: selectedColors,
      images: img,
    };
    if (
      payloadTest !== data &&
      selectedSizes.length !== 0 &&
      selectedColors.length !== 0
    ) {
      handleEditProduct(payload, data.id);
    } else {
      alert("Bạn không thay đổi thông tin sản phẩm");
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropComponent={Backdrop}
      fullWidth
      maxWidth="lg"
      disableEscapeKeyDown={true}
      keepMounted={false}
    >
      <Box className={classes.headerModal}>
        <DialogTitle color="#015A94" fontSize={20} fontWeight={700}>
          Chỉnh sửa thông tin sản phẩm
        </DialogTitle>
      </Box>
      <Divider />
      <Grid container columns={10}>
        <Grid item xs={5}>
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
                      sx={{ color: "#015A94", mb: "5px" }}
                      htmlFor="name"
                    >
                      Tên sản phẩm
                    </InputLabel>
                    <OutlinedInput
                      {...field}
                      sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                      id="name"
                      placeholder="Tên sản phẩm"
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
                    message: "Loại sản phẩm không được bỏ trống",
                  },
                }}
                name="category"
                render={({ field }) => (
                  <Box my="15px">
                    <InputLabel
                      sx={{ color: "#015A94", mb: "5px" }}
                      htmlFor="category"
                    >
                      Loại sản phẩm
                    </InputLabel>
                    <OutlinedInput
                      {...field}
                      sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                      id="category"
                      placeholder="Loại sản phẩm"
                      error={!isEmpty(errors.category)}
                      autoComplete="off"
                      className={classes.input}
                      fullWidth
                    />
                    {!isEmpty(errors.category) && (
                      <Typography fontSize={12} color="#ff0000" my="5px">
                        {get(errors, "category.message", "")}
                      </Typography>
                    )}
                  </Box>
                )}
              />
              <Controller
                control={control}
                name="gender"
                defaultValue={"M"}
                rules={{
                  required: {
                    value: true,
                    message: "Giới tính không được dể trống",
                  },
                }}
                render={({ field }) => {
                  return (
                    <Box>
                      <InputLabel
                        id="status-select"
                        sx={{ color: "#282828", fontSize: 14, mb: "5px" }}
                      >
                        Giới tính
                        <span>
                          (<span style={{ color: "#FF0000" }}>*</span>)
                        </span>
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="status-select"
                        fullWidth
                        sx={{ height: "40px", backgroundColor: "white" }}
                      >
                        {listGender.map((opt) => (
                          <MuiMenuItem key={opt} value={opt}>
                            {opt}
                          </MuiMenuItem>
                        ))}
                      </Select>
                    </Box>
                  );
                }}
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
                      sx={{ color: "#015A94", mb: "5px" }}
                      htmlFor="quantity"
                    >
                      Số lượng sản phẩm
                    </InputLabel>
                    <OutlinedInput
                      {...field}
                      sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                      id="quantity"
                      placeholder="số lượng sản phẩm"
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
                    message: "Giá không được bỏ trống",
                  },
                }}
                name="price"
                render={({ field }) => (
                  <Box my="15px">
                    <InputLabel
                      sx={{ color: "#015A94", mb: "5px" }}
                      htmlFor="price"
                    >
                      Giá sản phẩm
                    </InputLabel>
                    <OutlinedInput
                      {...field}
                      sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                      id="price"
                      placeholder="Giá sản phẩm"
                      error={!isEmpty(errors.price)}
                      autoComplete="off"
                      className={classes.input}
                      fullWidth
                    />
                    {!isEmpty(errors.price) && (
                      <Typography fontSize={12} color="#ff0000" my="5px">
                        {get(errors, "price.message", "")}
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
                    message: "Tên không được bỏ trống",
                  },
                }}
                name="description"
                render={({ field }) => (
                  <Box my="15px">
                    <InputLabel
                      sx={{ color: "#015A94", mb: "5px" }}
                      htmlFor="description"
                    >
                      Mô tả
                    </InputLabel>
                    <OutlinedInput
                      {...field}
                      sx={{ backgroundColor: "#E8E3E3", my: "10px" }}
                      id="description"
                      placeholder="Mô tả sản phẩm"
                      multiline
                      rows={5}
                      error={!isEmpty(errors.description)}
                      autoComplete="off"
                      className={classes.input}
                      fullWidth
                    />
                    {!isEmpty(errors.description) && (
                      <Typography fontSize={12} color="#ff0000" my="5px">
                        {get(errors, "description.message", "")}
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
                  Lưu sản phẩm
                </LoadingButton>
              </Box>
            </form>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Grid container xs={10}>
            <Grid item xs={5}>
              <Box mt="60px">
                <FormGroup>
                  <InputLabel
                    sx={{ color: "#015A94", mb: "5px" }}
                    htmlFor="size"
                  >
                    kích cỡ
                  </InputLabel>
                  {listSize.map((s: string) => {
                    return (
                      <FormControlLabel
                        key={s}
                        sx={{ px: "20px " }}
                        control={
                          <Checkbox
                            checked={selectedSizes.includes(s)}
                            onChange={() => handChangSize(s)}
                          />
                        }
                        label={s}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box mt="60px">
                <FormGroup>
                  <InputLabel
                    sx={{ color: "#015A94", mb: "5px" }}
                    htmlFor="color"
                  >
                    Màu sắc
                  </InputLabel>
                  {listColor.map((c: string) => {
                    return (
                      <FormControlLabel
                        key={c}
                        sx={{ px: "20px " }}
                        control={
                          <Checkbox
                            checked={selectedColors.includes(c)}
                            onChange={() => handChangColor(c)}
                          />
                        }
                        label={c}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
            </Grid>
          </Grid>
          <Box>
            <InputLabel sx={{ color: "#015A94", mb: "5px" }} htmlFor="color">
              Ảnh sản phẩm
            </InputLabel>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={onChangePicture} />
            </Button>
            {img && <Image width="160" height="160" src={img} alt="" />}
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default ModalEditProduct;
