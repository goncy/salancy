import * as React from "react";
import Head from "next/head";
import {ChakraProvider, Text, Container, Divider, Link, Stack} from "@chakra-ui/react";
import {AppProps} from "next/app";

import theme from "../theme";

const App: React.FC<AppProps> = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>Promedios de salarios - Salancy</title>
        <meta content="initial-scale=1.0, width=device-width" name="viewport" />
        {/* Inicio de meta tags de licencia - Cambiar el contenido de los mismos viola el contenido de los terminos de licencia */}
        <meta content="goncy" name="author" />
        <meta content="Gonzalo Pozzo" name="copyright" />
        {/* Fin de meta tags de licencia */}
      </Head>
      <ChakraProvider theme={theme}>
        <Container
          as={Stack}
          backgroundColor="white"
          borderRadius="sm"
          height="100%"
          justifyContent="space-between"
          maxWidth="container.xl"
          padding={4}
        >
          <Component {...pageProps} />
          {/* Inicio de copyright - Cambiar el contenido de los mismos viola el contenido de los terminos de licencia */}
          <Stack>
            <Divider marginY={4} />
            <Text textAlign="center">
              © Copyright {new Date().getFullYear()}. Hecho con ♥ para la comunidad, por{" "}
              <Link isExternal href="https://gonzalopozzo.com">
                goncy
              </Link>
              .
            </Text>
          </Stack>
          {/* Fin de copyright */}
        </Container>
      </ChakraProvider>
    </>
  );
};

export default App;
