import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { MuiThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@mui/material";
import React, { ReactElement, ReactNode } from "react";
import theme from "../styles/theme";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";
// import useApollo from '../graphql/use-apollo-2';
import client from "../graphql/use-apollo";

import type { NextPage } from "next";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: React.FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  const getLayout = Component.getLayout ?? ((page) => page);

  //  const client = useApollo(pageProps);
  return (
    <RecoilRoot>
      <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          {getLayout(<Component {...pageProps} />)}
        </ApolloProvider>
      </MuiThemeProvider>
    </RecoilRoot>
  );
};

export default MyApp;
