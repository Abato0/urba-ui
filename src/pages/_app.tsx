import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { MuiThemeProvider } from '@material-ui/core';
import { CssBaseline } from '@mui/material';
import React from 'react';
import theme from '../styles/theme';


function MyApp({ Component, pageProps }: AppProps) {
  
  
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if(jssStyles){
      jssStyles.parentElement!.removeChild(jssStyles);
    }

  


  }, []);
  return (<> <MuiThemeProvider theme={theme}> <Component {...pageProps} /></MuiThemeProvider></>)
}

export default MyApp
