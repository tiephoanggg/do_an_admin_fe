import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  headerModal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textarea: {
    width: "100%",
    height: "80px !important",
    borderRadius: "4px !important",
    border: "1px solid #C8C8C8 !important",
    padding: "10px",
    "&:focus-visible": {
      outline: "none !important",
    },
  },
  input: {
    borderRadius: "4px",
  },
  checkBox: {
    padding: "5px 9px !important",
  },
  btn: {
    backgroundColor: "#FF3366 !important",
    borderRadius: "4px",
    padding: "11px 24px !important",
    "&:hover": {
      backgroundColor: "#FF3366 !important",
    },
    boxShadow: "none !important",
  },
  form: {
    padding: "30px 50px",
    paddingBottom: "76px",
  },
}));

export interface ValueEditProductForm {
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
