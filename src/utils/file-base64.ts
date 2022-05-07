import { isEmpty, isNil } from 'ramda'

export const getBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export const codeBase64 = (data: string) => {
    return Buffer.from(data, 'utf8').toString('base64')
}

export const decodeBase64 = (base64Input: string) => {
    return Buffer.from(base64Input, 'base64').toString('utf8')
}

export async function getFileFromUrl(
    url: string,
    name: string,
    defaultType = 'image/jpeg'
) {
    try {
        if (isEmpty(url) || isNil(url)) {
            return undefined
        }
        const response = await fetch(url, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            method: 'GET',
            mode: 'cors',
        })
        const data = await response.blob()
        return new File([data], name, {
            type: data.type || defaultType,
        })
    } catch (error) {
        console.log('Error: ', (error as Error).message)
        return undefined
    }
}
