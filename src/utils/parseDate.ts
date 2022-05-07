import { eachMonthOfInterval, lightFormat } from 'date-fns'
import { head, isEmpty, join, last, split, tail } from 'ramda'
import { IAporteVariables } from '../components/aporte/use-aporte'
import { arrMeses } from '../components/core/input/dateSelect'

export const parseStringDate = (date: string) => {
    if (!isEmpty(date)) {
        const arrString = date.split('-')
        return new Date(
            Number(arrString[0]),
            Number(arrString[1]) - 1,
            Number(arrString[2])
        )
    }
}

export const rangoFechaAportePagoService = (aporte: IAporteVariables) => {
    const { fecha_inicio, fecha_fin } = aporte
    const arrDate = eachMonthOfInterval({
        start: parseStringDate(fecha_inicio)!,
        end: parseStringDate(fecha_fin)!,
    })

    const arrDateString = arrDate.map((date) => {
        return parseDateMesAnio(lightFormat(date, 'dd-MM-yyyy'))
    })
    return arrDateString
}

const parseDateMesAnio = (date: string) => {
    const arradata = tail(split('-', date))
    const mes = arrMeses[Number(head(arradata))]
    const anio = last(arradata)
    console.log('date: ', join('-', [mes, anio]))
    return join('-', [mes, anio])
}
