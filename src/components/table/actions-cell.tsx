import React, { useMemo, useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashIcon,
} from 'mdi-material-ui'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../utils/states'
import { TipoUsuario } from '../core/input/dateSelect'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'

interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row
}

const ActionsCell: React.FC<IProps> = ({
    onEdit,
    onDelete,
    row,
    className,
}) => {
    const usuarioState = useRecoilValue(userInfo)

    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)

    const moradorFlag = useMemo(() => {
        if (usuarioState) {
            return usuarioState.tipo_usuario === TipoUsuario.MORADOR
        }
        return false
    }, [usuarioState])

    const administradorFlag = useMemo(() => {
        if (usuarioState) {
            return usuarioState.tipo_usuario === TipoUsuario.ADMIN
        }
        return false
    }, [usuarioState])

    return (
        <>
            <ModalConfirmacion
                openModal={openModalConfirmacion}
                onConfirm={() => {
                    setOpenModalConfirmacion(false)
                    onDelete(row.original)
                }}
                mensaje="¿Está seguro de eliminar el registro seleccionado?"
                onCancel={() => setOpenModalConfirmacion(false)}
            />
            {!moradorFlag && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Tooltip
                        className={className}
                        placement="right"
                        title={'Editar'}
                    >
                        <IconButton onClick={() => onEdit(row.original)}>
                            <FileEditIcon color="primary" />
                        </IconButton>
                    </Tooltip>

                    {administradorFlag && (
                        <Tooltip
                            className={className}
                            placement="right"
                            title={'Eliminar'}
                        >
                            <IconButton
                                onClick={() => setOpenModalConfirmacion(true)}
                                //onClick={() => onDelete(row.original)}
                            >
                                <TrashIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            )}
        </>
    )
}

export default ActionsCell
