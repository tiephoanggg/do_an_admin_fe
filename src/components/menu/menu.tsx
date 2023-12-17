import React from "react";

import {
  PercentageOutlined,
  IdcardOutlined,
  FormOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "public/img/logo2.png";
import { Box, Typography } from "@mui/material";
import "./style.css";
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const MenuPage: React.FC = () => {
  const router = useRouter();
  const items: MenuProps["items"] = [
    getItem("Sản Phẩm", "Sản Phẩm", <IdcardOutlined />, [
      getItem("Danh sách sản phẩm", "ListProduct", null),
      getItem("Thêm sản phẩm", "AddProduct", null),
    ]),
    getItem("Voucher", "Voucher", <PercentageOutlined />, [
      getItem("Danh sách Voucher", "Voucher", null),
      getItem("Thêm voucher", "AddVoucher", null),
    ]),
    getItem("Phê duyệt", "Phê duyệt", <FormOutlined />, [
      getItem("Danh sách chờ phê duyệt", "ApprovePending", null),
      getItem("Danh sách đã phê duyệt", "ApproveSucsess", null),
      getItem("Danh sách từ chối đã phê duyệt", "ApproveFaile", null),
    ]),
    getItem("Thống kê", "Statistics", <BarChartOutlined />),
  ];
  const onClick: MenuProps["onClick"] = (e) => {
    console.log(e);
    router.push(e.key);
  };

  return (
    <div>
      <div className="bg-white  ">
        <Box display="flex">
          <Image src={logo} alt="" />
        </Box>
      </div>
      <Menu
        onClick={onClick}
        style={{ width: 300, height: 1080 }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default MenuPage;
