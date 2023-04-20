import Layout from "@/components/Layout";
import React from "react";

export default function Notes() {
  return <></>;
}

Notes.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};