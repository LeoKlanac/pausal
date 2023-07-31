import { Layout } from "../../client/layout/layout";
import { ReactElement } from "react";
import * as React from "react";
import { OnBoarding } from "../../client/components/pocetna-forma/OnBoarding";

export default function Pocetna() {
  return (
    <div>
      <OnBoarding />
    </div>
  );
}

Pocetna.getLayout = function getLayout(page: ReactElement) {
  return <Layout title={"Početna"}>{page}</Layout>;
};
