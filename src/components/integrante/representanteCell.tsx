import { Typography } from '@material-ui/core'
import { FC } from 'react'
import { Row } from 'react-table'
import { IIntegranteVariables } from './use-intergrante'
import { Circle } from 'mdi-material-ui'

interface IProops {
    row: Row<IIntegranteVariables>
}

const RepresentanteCells: FC<IProops> = ({ row }) => {
    return (
        <Typography>
            {row.original.representante === 'A' && (
                <Circle color="success"></Circle>
            )}
        </Typography>
    )
}

export default RepresentanteCells
