import { parseCookies } from 'nookies'
import { NextPageContext } from 'next'

const AUTH_COOKIE = process.env.NEXT_PUBLIC_W532_AUTH_COOKIE

const getAuthToken = (ctx: NextPageContext) => {
    const cookies = parseCookies(ctx)

    // // eslint-disable-next-line security/detect-object-injection
    return cookies[AUTH_COOKIE!]
}

export default getAuthToken
