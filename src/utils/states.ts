import { atom } from 'recoil'

export interface IUserInfo {
    id: number
    user: string
    tipo_usuario: string
    nombres: string
    apellidos: string
    num_identificacion: string
    token?: string
}

export const userInfo = atom<IUserInfo | null>({
    key: 'UserInfo',
    default: null,
})

export const showSidebar = atom<boolean>({
    key: 'ShowSidebar',
    default: true,
})
