import { parseCookies } from 'nookies'
import { NextPageContext } from 'next'

const AUTH_COOKIE = process.env.NEXT_PUBLIC_W532_AUTH_COOKIE

const getAuthToken = (ctx: NextPageContext) => {
    const cookies = parseCookies(ctx)
    return cookies[AUTH_COOKIE!]
}

export default getAuthToken
