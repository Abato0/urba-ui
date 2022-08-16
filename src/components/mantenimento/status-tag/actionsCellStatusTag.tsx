import React, { useMemo } from 'react'
import { Button, IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
    AlarmLight as AlarmLightIcon,
    AlarmLightOff as AlarmLigthOffIcon
} from 'mdi-material-ui'
import { IResultQueryStatusTag } from './use-status-tag'
import { ID_STATUS_TAG_DISPONIBLE, ID_STATUS_TAG_INACTIVO, ID_STATUS_TAG_OCUPADO } from '../../../utils/keys'

interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row<IResultQueryStatusTag>
}

const ids = [ID_STATUS_TAG_DISPONIBLE, ID_STATUS_TAG_INACTIVO, ID_STATUS_TAG_OCUPADO]

const ActionsCellEditDelete: React.FC<IProps> = ({
    onEdit,
    onDelete,
    row,
    className,
}) => {

    const visible = useMemo(() => {
        return ids.some((id) => row.original.id === id)
    }, [row, ids])

    return (
        <>
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
                    disabled={visible}

                    onClick={() => onDelete(row.original)}
                >
                    <TrashCanIcon color="primary" />
                </IconButton>
            </Tooltip>
        </>
    )
}

export default ActionsCellEditDelete
