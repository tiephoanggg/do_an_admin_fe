"use client";
import MenuPage from "@/components/menu/menu";
import { Box, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const storedToken = Cookies.get("accessToken");
  useEffect(() => {
    if (!storedToken) {
      router.push("/Login");
    } else {
      router.push("/ListProduct");
    }
  }, []);
  return (
    <Box display="flex" flexDirection="row">
      <MenuPage />
      <Typography></Typography>
    </Box>
  );
}
