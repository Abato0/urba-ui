import { Typography } from '@material-ui/core'
import React, { useMemo } from 'react'
import { Row } from 'react-table'
import { IGrupoFamiliarNormalize } from '../../pages/grupo-familiar/listado'

interface IProps {
    row: Row<IGrupoFamiliarNormalize>
}
const NombreGrupoFamiliarCell: React.FC<IProps> = ({ row }) => {
    const nombre = useMemo(() => {
        if (row.original) {
            const { original } = row
            return `${original.nombre_familiar}-${original.manzana}-${original.villa}`
        }
        return ''
    }, [row])

    return <Typography>{nombre}</Typography>
}

export default NombreGrupoFamiliarCell
