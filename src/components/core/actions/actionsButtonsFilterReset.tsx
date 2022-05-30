import { IconButton, Tooltip } from '@material-ui/core'
import { FC } from 'react'
import { Reload as ReloadIcon, TableSearch } from 'mdi-material-ui'

interface IProps {
    filtrar: () => void
    reset: () => void
}

export const ActionsButtonsFilterReset: FC<IProps> = ({ filtrar, reset }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Tooltip title="Filtrar" placement="top">
                <IconButton color="primary" onClick={filtrar}>
                    <TableSearch color="primary" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Limpiar" placement="top">
                <IconButton color="primary" onClick={reset}>
                    <ReloadIcon color="primary" />
                </IconButton>
            </Tooltip>
        </div>
    )
}
