import React, { useMemo } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import IconButton from '@material-ui/core/IconButton'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
    AccountSettings as AccountSettingsIcon,
    KeyOutline as KeyOutlineIcon,
} from 'mdi-material-ui'
import { IUsuarioNormalize } from '../../pages/usuario/ingresar'
import { equals } from 'ramda'
import { TipoUsuario } from '../core/input/dateSelect'

interface IProps {
    className?: string
    onDelete: (row: any) => Promise<void>
    onVincular: (row: any) => void
    onEditar: (row: any) => void
    row: Row<IUsuarioNormalize>
    onVerificar: (row: any) => boolean
    onChangePassword: (row: any) => void
}

const ActionsUsuarioCellEditDelete: React.FC<IProps> = ({
    onDelete,
    row,
    className,
    onVincular,
    onEditar,
    onVerificar,
    onChangePassword,
}) => {
    const disable = useMemo(() => {
        if (
            row.original &&
            row.original.tipo_usuario &&
            equals(TipoUsuario.MORADOR, row.original.tipo_usuario)
        ) {
            return false
        }
        return true
    }, [row.original])

    // console.log("***row:", row.original)
    return (
        // <Tooltip className={className} title={"Editar"}>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            {/* <Tooltip title="Vincular" placement="top">
                <IconButton
                    // variant="text"
                    disabled={disable || !onVerificar(row.original)}
                    color="primary"
                    onClick={() => onVincular(row.original)}
                >
                    <AccountSettingsIcon />
                </IconButton>
            </Tooltip> */}
            {/* <Tooltip title="Reestablecer Contraseña" placement="top">
                <IconButton
                    // variant="text"
                    color="primary"
                    onClick={() => onChangePassword(row.original)}
                >
                    <KeyOutlineIcon />
                </IconButton>
            </Tooltip> */}
            <Tooltip title="Editar" placement="top">
                <IconButton
                    // variant="text"
                    color="primary"
                    onClick={() => onEditar(row.original)}
                >
                    <FileEditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar" placement="top">
                <IconButton
                    // variant="text"
                    color="primary"
                    onClick={() => onDelete(row.original)}
                >
                    <TrashCanIcon />
                </IconButton>
            </Tooltip>
        </div>
        // </Tooltip>
    )
}

export default ActionsUsuarioCellEditDelete
