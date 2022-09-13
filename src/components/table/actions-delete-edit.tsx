import React, { useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
    AlarmLight as AlarmLightIcon,
    AlarmLightOff as AlarmLigthOffIcon,
} from 'mdi-material-ui'
import { IResultQueryTag } from '../tag/use-tag'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'

interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row<IResultQueryTag>
}

const ActionsCellEditDelete: React.FC<IProps> = ({
    onEdit,
    onDelete,
    row,
    className,
}) => {
    console.log('row Tag: ', row.original)
    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)
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
            <Tooltip placeholder="top" className={className} title={'Editar'}>
                <IconButton
                    // variant="text"

                    color="secondary"
                    onClick={() => onEdit(row.original)}
                >
                    <FileEditIcon color="primary" />
                </IconButton>
            </Tooltip>

            <Tooltip placeholder="top" className={className} title={'Eliminar'}>
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
    )
}

export default ActionsCellEditDelete
