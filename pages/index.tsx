import * as React from "react";
import {GetStaticProps} from "next";

import {Salary} from "../salary/types";
import api from "../salary/api";
import SalariesScreen from "../salary/screens/Salaries";

interface Props {
  salaries: Salary[];
}

const IndexRoute: React.FC<Props> = ({salaries}) => {
  return <SalariesScreen salaries={salaries} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const salaries = await api.list();

  return {
    revalidate: 3600,
    props: {
      salaries,
    },
  };
};

export default IndexRoute;
