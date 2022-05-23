import { atom } from 'recoil'

export interface IUserInfo {
    user: string
    tipo_usuario: string
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

/*
{token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IntcI…TM4fQ._rV82BVzuGSOzbZ0KaYgms_pi2itLDYMdVNFD_DrjO0', user: 'rabata', tipo_usuario: 'administrador'}

*/
