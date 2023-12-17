import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

export const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      display: "flex",
      flex: "1 1 0%",
      width: "100%",
      flexDirection: "column",
      height: "100vh",
    },
    mainContent: {
      display: "flex",
      width: "100%",
      flex: "1 1 0%",
      padding: "20px",
      justifyContent: "center",
      alignItems: "center",
    },
    imgWrapper: {
      textAlign: "center",
    },
    img: {
      width: "55px",
      heigth: "100%",
      objectFit: "cover",
    },
    paper: {
      overflow: "hidden",
      minWidth: "640px",
      borderRadius: "8px",
    },
    title: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: "26px",
      paddingBottom: "26px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    form: {
      padding: "30px 50px",
      paddingBottom: "76px",
    },
    input: {
      borderRadius: "4px",
    },
    register: {
      fontWeight: 600,
      marginLeft: "10px",
      textDecoration: "none",
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
  };
});
