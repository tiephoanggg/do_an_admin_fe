"use client";
import MenuPage from "@/components/menu/menu";
import { Box, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Space, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import axios from "axios";
import ModalEditProduct from "@/components/modal/ModalEditProduct/ModalEditProduct";
import { LogoutOutlined } from "@ant-design/icons";
interface DataType {
  id: string;
  userId: string;
  products: any;
  voucher: string;
  finalPrice: number;
}

export default function ApproveFaile() {
  const router = useRouter();
  const storedToken = Cookies.get("accessToken");
  const [dataApprovePending, setApprovePending] = useState<any>([]);

  const handleApprovePending = async () => {
    axios
      .get(`http://localhost:4000/v4/product/isConfirmTwo/queue`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(function (res) {
        // handle success
        console.log(res);
        const dataFill = res.data.data.map((item: any) => {
          return {
            id: item._id,
            userId: item.user_id,
            products: item.products,
            voucher: item.voucher,
            finalPrice: item.finalPrice?.toLocaleString("de-DE"),
          };
        });
        console.log(dataFill);
        setApprovePending(dataFill);
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

    handleApprovePending();
  }, []);
  const handleApprove = async (data: any) => {
    console.log(data);
    const payload = { newIsConfirmValue: 1, queueId: data.id };
    await axios
      .post(`v4/product/updateIsConfirm/queue`, payload, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        console.log(res);
        alert("phê duyệt thành công");
        handleApprovePending();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleApproveCancel = async (data: any) => {
    console.log(data);
    const payload = { newIsConfirmValue: 2, queueId: data.id };
    await axios
      .post(`v4/product/updateIsConfirm/queue`, payload, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        console.log(res);
        alert("Hủy đơn thành công");
        handleApprovePending();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Id người mua",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (_, record) => (
        <Box display="flex" flexDirection="column">
          {record.products.map((product: any) => {
            return (
              <Typography key={product.product}>
                sản phẩm: {product.product}, số lượng: {product.quantity}, kích
                cỡ:{product.size}, màu sắc:{product.color}
              </Typography>
            );
          })}
        </Box>
      ),
    },

    {
      title: "Voucher",
      dataIndex: "voucher",
      key: "voucher",
    },
    {
      title: "Giá trị đơn hàng",
      dataIndex: "finalPrice",
      key: "finalPrice",
    },
  ];
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
            Danh sách đơn hàng từ chối phê duyệt
          </Typography>
        </Box>
        <Box
          px="80px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Table
            columns={columns}
            pagination={{ pageSize: 8 }}
            dataSource={dataApprovePending}
          />
        </Box>
      </Box>
    </Box>
  );
}
