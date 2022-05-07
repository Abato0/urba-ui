import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { MuiThemeProvider } from '@material-ui/core'
import { CssBaseline } from '@mui/material'
import React, { ReactElement, ReactNode } from 'react'
import theme from '../styles/theme'
import { RecoilRoot } from 'recoil'
import { ApolloProvider } from '@apollo/client'
// import useApollo from '../graphql/use-apollo-2';
import client from '../graphql/use-apollo'

import type { NextPage } from 'next'
import NavBar from '../components/layout/app-bar'
import AppLayout from '../components/layout/app-layout'
import Cookies from 'js-cookie'
import { authMe } from '../auth/auth-service'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const MyApp: React.FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles)
        }
    }, [])

    const getLayout = Component.getLayout ?? ((page) => page)

    // const autho = async () => {
    //   try {
    //     const token = Cookies.get("token");
    //     if (token) {
    //       setLoading(true);
    //       const result = await authMe(token);
    //       if (result && result.code === 200) {
    //         setAuthFlag(true);
    //         await redirectLogin();
    //       }
    //       setLoading(false);
    //     } else {
    //       setAuthFlag(false);
    //     }
    //     console.log("token: ", token);
    //   } catch (error) {
    //     setAuthFlag(false);
    //     setLoading(false);
    //     //   await redirectLogin();
    //     console.log("error: ", (error as Error).message);
    //   }
    // };

    //  const client = useApollo(pageProps);
    return (
        <RecoilRoot>
            <MuiThemeProvider theme={theme}>
                <ApolloProvider client={client}>
                    {getLayout(
                        // <AppLayout>
                        <Component {...pageProps} />
                        // </AppLayout>
                    )}
                </ApolloProvider>
            </MuiThemeProvider>
        </RecoilRoot>
    )
}

export default MyApp
