"use client";
import MenuPage from "@/components/menu/menu";
import { Box, Stack, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { DatePicker, DatePickerProps, Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import axios from "axios";
import ModalEditProduct from "@/components/modal/ModalEditProduct/ModalEditProduct";
import dayjs from "dayjs";
import moment from "moment";
import { LogoutOutlined } from "@ant-design/icons";
interface DataType {
  productId: any;

  quantity: any;
  price: any;
}

export default function Statistics() {
  const router = useRouter();
  const storedToken = Cookies.get("accessToken");
  const role = Cookies.get("role");
  const [dataStatistics, setStatistics] = useState<any>([]);
  const [timePicker, setTimePicker] = useState<any>(dayjs(new Date()));
  const TimeDefau: any = dayjs(new Date());
  var today = new Date();

  // Lấy thông tin về ngày, tháng, năm
  var year = today.getFullYear();
  var month = today.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
  var day = today.getDate();

  // Định dạng ngày theo yyyy-mm-dd
  var formattedDate =
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day);

  const handleStatistics = async (data: any) => {
    axios
      .get(
        `http://localhost:4000/v4/product/statistical/queue?start=${data}&end=${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then(function (res) {
        // handle success
        console.log(res);
        const dataFill = res.data.data.products.map((item: any) => {
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          };
        });
        dataFill.push({
          productId: "Tổng",
          quantity: res.data.data.totalQuantity,
          price: res.data.data.totalPrice,
        });
        console.log(dataFill);
        setStatistics(dataFill);
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  useEffect(() => {
    if (!storedToken) {
      router.push("/Login");
    }

    handleStatistics(formattedDate);
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: "Mã đơn hàng ",
      dataIndex: "productId",
      key: "productId",
      render: (_, record) => (
        <Space size="middle">
          {record.productId === "Tổng" && (
            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
              {record.productId}
            </Typography>
          )}
          {record.productId !== "Tổng" && (
            <Typography>{record.productId}</Typography>
          )}
        </Space>
      ),
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "quantity",
      key: "quantity",
      render: (_, record) => (
        <Space size="middle">
          {record.productId === "Tổng" && (
            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
              {record.quantity}
            </Typography>
          )}
          {record.productId !== "Tổng" && (
            <Typography>{record.quantity}</Typography>
          )}
        </Space>
      ),
    },
    {
      title: "doanh thu",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <Space size="middle">
          {record.productId === "Tổng" && (
            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
              {record.price}
            </Typography>
          )}
          {record.productId !== "Tổng" && (
            <Typography>{record.price}</Typography>
          )}
        </Space>
      ),
    },
  ];
  const onChangePicker: DatePickerProps["onChange"] = (date, dateString) => {
    setTimePicker(dayjs(dateString));
    console.log(dateString);
    handleStatistics(dateString);
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
      {role === "boss" && (
        <Box width={1580}>
          <Box display="flex" justifyContent="flex-end" mt="40px">
            <LogoutOutlined
              onClick={handleLogout}
              style={{ fontSize: "26px", color: "#000000" }}
            />
          </Box>
          <Box
            px="80px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              sx={{ fontWeight: 500, fontSize: "48px", color: "#000000" }}
              my="30px"
            >
              Thống kê
            </Typography>
          </Box>
          <Box display="flex" flexDirection="row">
            <Box px="80px" sx={{ display: "flex", flexDirection: "row" }}>
              <Stack
                direction="column"
                alignSelf="flex-start"
                alignItems={"flex-start"}
                spacing="10px"
                mt="20px"
                mb="10px"
                mr="100px"
              >
                <Typography
                  sx={{ fontWeight: 700, fontSize: "14px", color: "#015A94" }}
                >
                  Thời gian ➔ hiện tại
                </Typography>
                <DatePicker
                  style={{ height: "40px", borderRadius: "15px" }}
                  onChange={onChangePicker}
                  defaultValue={TimeDefau}
                />
              </Stack>
            </Box>
            <Box
              px="150px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mt="30px"
            >
              <Table
                columns={columns}
                pagination={{ pageSize: 8 }}
                dataSource={dataStatistics}
              />
            </Box>
          </Box>
        </Box>
      )}
      {role !== "boss" && (
        <Box>
          <Box
            px="80px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              sx={{ fontWeight: 500, fontSize: "48px", color: "#000000" }}
              my="30px"
            >
              Bạn chưa được cấp quyền để truy cập trang này
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
