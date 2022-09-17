import React, { useMemo, useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
    AlarmLight as AlarmLightIcon,
    AlarmLightOff as AlarmLigthOffIcon,
} from 'mdi-material-ui'
import { ModalConfirmacion } from '../../core/modal/modalConfirmacion'
import {
    ID_VALOR_TAG_PRIMERA_VEZ,
    ID_VALOR_TAG_RENOVACION,
    ID_VALOR_REPOSICION,
} from '../../../utils/keys'

interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row<any>
}

const ActionsCellEditDeleteValoresTag: React.FC<IProps> = ({
    onEdit,
    onDelete,
    row,
    className,
}) => {
    // console.log('row Tag: ', row.original)

    const enableDelete = useMemo(() => {
        if (
            row.original.id &&
            (row.original.id === ID_VALOR_TAG_PRIMERA_VEZ ||
                row.original.id === ID_VALOR_TAG_RENOVACION ||
                row.original.id === ID_VALOR_REPOSICION)
        ) {
            return false
        }
        return true
    }, [row])
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

            {enableDelete && (
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
            )}
        </>
    )
}

export default ActionsCellEditDeleteValoresTag
