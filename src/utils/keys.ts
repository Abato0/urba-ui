// import dotenv from 'dotenv'
// dotenv.config()

export const URL_BASE_API= (): string =>{
    return process.env.NEXT_PUBLIC_BASE_API_UR ?? ""
}