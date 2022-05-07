import { isServer } from '../utils/is-server-browser'
import { trim } from 'ramda'
import Cookies from 'js-cookie'
import urlJoin from 'url-join'
export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'

const authLink = setContext((_, { headers }) => {
    const token = Cookies.get('token')
    return {
        headers: {
            ...headers,
            authorization: token,
        },
    }
})

const httpLink = createUploadLink({
    uri: urlJoin(trim(API_BASE_URL!), '/api/graphql'),
    includeExtensions: true,
})

const client = new ApolloClient({
    ssrMode: isServer(),
    ssrForceFetchDelay: 200,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
})

export default client
