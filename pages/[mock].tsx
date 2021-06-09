import {ParsedUrlQuery} from "querystring";

import * as React from "react";
import {GetStaticPaths, GetStaticProps} from "next";

import {Salary} from "../salary/types";
import api from "../salary/api";
import SalariesScreen from "../salary/screens/Salaries";

interface Props {
  salaries: Salary[];
}

interface Params extends ParsedUrlQuery {
  mock: string;
}

const IndexRoute: React.FC<Props> = ({salaries}) => {
  return <SalariesScreen salaries={salaries} />;
};

export const getStaticProps: GetStaticProps<unknown, Params> = async ({params}) => {
  const salaries = await api.mock.list(params.mock);

  return {
    revalidate: 10,
    props: {
      salaries,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: process.env.NODE_ENV === "production" ? false : "blocking",
  };
};

export default IndexRoute;
