import axios from "axios";
import Papa from "papaparse";

import {Salary} from "./types";

export default {
  list: async (): Promise<Salary[]> => {
    return axios
      .get(process.env.NEXT_PUBLIC_SHEET, {
        responseType: "blob",
      })
      .then(
        (response) =>
          new Promise<Salary[]>((resolve, reject) => {
            Papa.parse(response.data, {
              header: true,
              complete: (results) => resolve(results.data as Salary[]),
              error: (error) => reject(error.message),
            });
          }),
      );
  },
  mock: {
    list: (mock: string): Promise<Salary[]> =>
      import(`./mocks/${mock}.json`).then((result) => result.default),
  },
};
