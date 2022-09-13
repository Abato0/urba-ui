import React, { useMemo, useState } from 'react'
import { Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import IconButton from '@material-ui/core/IconButton'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
} from 'mdi-material-ui'
import { IUsuarioNormalize } from '../../pages/usuario/ingresar'
import { equals } from 'ramda'
import { TipoUsuario } from '../core/input/dateSelect'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'

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

    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)

    // console.log("***row:", row.original)
    return (
        // <Tooltip className={className} title={"Editar"}>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <ModalConfirmacion
                openModal={openModalConfirmacion}
                onConfirm={() => {
                    setOpenModalConfirmacion(false)
                    onDelete(row.original)
                }}
                mensaje="¿Está seguro de eliminar el registro seleccionado?"
                onCancel={() => setOpenModalConfirmacion(false)}
            />
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
                    onClick={() => setOpenModalConfirmacion(true)}
                    //   onClick={() => onDelete(row.original)}
                >
                    <TrashCanIcon />
                </IconButton>
            </Tooltip>
        </div>
        // </Tooltip>
    )
}

export default ActionsUsuarioCellEditDelete
