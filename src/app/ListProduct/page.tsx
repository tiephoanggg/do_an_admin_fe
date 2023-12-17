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
  name: string;
  category: string;
  description: string;
  quantity: number;
  size: string[];
  images: string[];
  color: string[];
  price: number;
  gender: string;
}

export default function ListProduct() {
  const router = useRouter();
  const storedToken = Cookies.get("accessToken");
  const [dataProduct, setDataProduct] = useState<any>([]);
  const [openModal, setOpenModal] = React.useState<string | null>(null);
  const [selectProduct, setSelectProduct] = useState<any>([]);
  const handleGetProduct = async () => {
    axios
      .get(`http://localhost:4000/v4/product/all/list`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then(function (res) {
        // handle success
        console.log(res);
        const dataFill = res.data.data.map((item: any) => {
          return {
            id: item._id,
            name: item.name,
            category: item.category,
            description: item.description,
            price: item.price.toLocaleString("de-DE"),
            quantity: item.quantity,
            color: item.colors,
            size: item.sizes,
            images: item.images,
            gender: item.gender,
          };
        });
        console.log(dataFill);
        setDataProduct(dataFill);
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

    handleGetProduct();
  }, []);

  const handleDel = async (data: any) => {
    console.log(data);

    await axios
      .delete(`http://localhost:4000/v4/product/${data.id}/deleteProduct`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        console.log(res);
        handleGetProduct();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenModalEditProductModal = (e: any) => {
    setOpenModal("changeProduct");
    setSelectProduct(e);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: "Sản phẩm",
      key: "product",
      dataIndex: "product",
      render: (_, { images }) => (
        <>
          {images.map((image) => {
            return (
              <Image key={image} width="160" height="160" src={image} alt="" />
            );
          })}
        </>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Kích cỡ",
      dataIndex: "size",
      key: "size",
      render: (_, record) => (
        <Space size="middle">
          <Typography>{record.size.join(",")}</Typography>
        </Space>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (_, record) => (
        <Space size="middle">
          <Typography>{record.color.join(",")}</Typography>
        </Space>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a className="underline" onClick={() => handleDel(record)}>
            Delete
          </a>
          <a
            className="underline"
            onClick={() => handleOpenModalEditProductModal(record)}
          >
            Edit
          </a>
        </Space>
      ),
    },
  ];
  const onCloseModal = () => {
    setOpenModal(null);
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
            Danh sách sản phẩm
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
            pagination={{ pageSize: 4 }}
            dataSource={dataProduct}
          />
        </Box>
      </Box>
      <ModalEditProduct
        visible={openModal === "changeProduct"}
        onClose={onCloseModal}
        data={selectProduct}
      />
    </Box>
  );
}
