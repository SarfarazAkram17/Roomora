"use client";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";

const PaginationClient = ({ current, total, pageSize }) => {
  const router = useRouter();

  return (
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      showSizeChanger={false}
      onChange={(page) => {
        router.push(`/hotels?page=${page}`);
      }}
    />
  );
};

export default PaginationClient;