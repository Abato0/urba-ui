import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { MuiThemeProvider } from '@material-ui/core';
import { CssBaseline } from '@mui/material';
import React from 'react';
import theme from '../styles/theme';
import { RecoilRoot } from 'recoil'
import { ApolloProvider } from "@apollo/client";
// import useApollo from '../graphql/use-apollo-2';
 import client  from '../graphql/use-apollo'

const MyApp: React.FC< AppProps>=({ Component, pageProps })=>{


  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if(jssStyles){
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  //  const client = useApollo(pageProps);
  return (
  <RecoilRoot>  
    <MuiThemeProvider theme={theme}>
      <ApolloProvider client={client}>
         <Component {...pageProps} />
      </ApolloProvider>
    </MuiThemeProvider>
  </RecoilRoot>)
}

export default MyApp
