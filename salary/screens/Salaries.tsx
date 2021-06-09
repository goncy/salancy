import * as React from "react";
import {Stack, Text, Table, Thead, Tbody, Tr, Th, Td, Select} from "@chakra-ui/react";

import {Salary} from "../types";
import {parseCurrency} from "../../utils/currency";
import {getUniqueProperties} from "../utils";

interface Props {
  salaries: Salary[];
}

const SalariesScreen: React.FC<Props> = ({salaries}) => {
  const [position, setPosition] = React.useState<Salary["position"]>(null);
  const [seniority, setSeniority] = React.useState<Salary["seniority"]>(null);
  const [currency, setCurrency] = React.useState<Salary["currency"]>(null);
  const positions = React.useMemo(() => getUniqueProperties(salaries, "position"), [salaries]);
  const seniorities = React.useMemo(() => getUniqueProperties(salaries, "seniority"), [salaries]);
  const currencies = React.useMemo(() => getUniqueProperties(salaries, "currency"), [salaries]);
  const matches = React.useMemo(
    () =>
      salaries.filter(
        (salary) =>
          (position ? salary.position === position : true) &&
          (seniority ? salary.seniority === seniority : true) &&
          (currency ? salary.currency === currency : true),
      ),
    [salaries, position, seniority, currency],
  );

  return (
    <Stack spacing={6}>
      <Stack direction={{base: "column", md: "row"}} spacing={4}>
        <Select onChange={(event) => setPosition(event.target.value)}>
          <option value="">Todas las posiciones</option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </Select>
        <Select onChange={(event) => setSeniority(event.target.value as Salary["seniority"])}>
          <option value="">Todos los seniorities</option>
          {seniorities.map((seniority) => (
            <option key={seniority} value={seniority}>
              {seniority}
            </option>
          ))}
        </Select>
        <Select onChange={(event) => setCurrency(event.target.value as Salary["currency"])}>
          <option value="">Todas las monedas</option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
      </Stack>
      {matches.length ? (
        <Table colorScheme="primary">
          <Thead>
            <Tr>
              <Th>Posición</Th>
              <Th>Seniority</Th>
              <Th>Moneda</Th>
              <Th>Cantidad de sueldos</Th>
              <Th isNumeric>Promedio</Th>
            </Tr>
          </Thead>
          <Tbody>
            {matches.map((salary) => (
              <Tr key={`${salary.position}-${salary.seniority}-${salary.currency}`}>
                <Td>{salary.position}</Td>
                <Td>{salary.seniority}</Td>
                <Td>{salary.currency}</Td>
                <Td>{salary.count}</Td>
                <Td isNumeric>{parseCurrency(salary.value, salary.currency)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text color="gray.500" fontSize="lg" margin="auto">
          No hay salarios
        </Text>
      )}
    </Stack>
  );
};

export default SalariesScreen;
