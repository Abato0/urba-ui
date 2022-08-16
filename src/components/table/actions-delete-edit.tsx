import React from 'react'
import { Button, IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
    AlarmLight as AlarmLightIcon,
    AlarmLightOff as AlarmLigthOffIcon
} from 'mdi-material-ui'
import { IResultQueryTag, EstadoTag, EstadoTagRow } from '../tag/use-tag';

interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row<IResultQueryTag>,
}

const ActionsCellEditDelete: React.FC<IProps> = ({
    onEdit,
    onDelete,
    row,
    className,
}) => {
    console.log("row Tag: ", row.original)
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
                    onClick={() => onDelete(row.original)}
                >
                    <TrashCanIcon color="primary" />
                </IconButton>
            </Tooltip>
        </>
    )
}

export default ActionsCellEditDelete
