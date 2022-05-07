import { atom } from 'recoil'

export interface IUserInfo {
    user: string
    tipo_usuario: string
}

export const userInfo = atom<IUserInfo | null>({
    key: 'UserInfo',
    default: null,
})

export const showSidebar = atom<boolean>({
    key: 'ShowSidebar',
    default: true,
})
