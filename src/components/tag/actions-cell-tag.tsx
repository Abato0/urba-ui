import React, { useMemo, useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
} from 'mdi-material-ui'
import { IResultQueryTag } from './use-tag'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'
import { userInfo } from '../../utils/states'
import { useRecoilValue } from 'recoil'
import { TipoUsuario } from '../core/input/dateSelect'

interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row<IResultQueryTag>
}

const ActionsCellEditDeleteTag: React.FC<IProps> = ({
    onEdit,
    onDelete,
    row,
    className,
}) => {
    // console.log('row Tag: ', row.original)
    const usuarioState = useRecoilValue(userInfo)
    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)
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
            {administradorFlag && (
                <>
                    <Tooltip
                        placeholder="top"
                        className={className}
                        title={'Editar'}
                    >
                        <IconButton
                            color="secondary"
                            onClick={() => onEdit(row.original)}
                        >
                            <FileEditIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        placeholder="top"
                        className={className}
                        title={'Eliminar'}
                    >
                        <IconButton
                            // variant="text"
                            color="secondary"
                            // onClick={() => onDelete(row.original)}
                            onClick={() => setOpenModalConfirmacion(true)}
                        >
                            <TrashCanIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </>
    )
}

export default ActionsCellEditDeleteTag
