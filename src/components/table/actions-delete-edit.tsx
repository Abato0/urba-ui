import React from 'react'
import { Button, IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashCanIcon,
} from 'mdi-material-ui'

interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row
}

const ActionsCellEditDelete: React.FC<IProps> = ({
    onEdit,
    onDelete,
    row,
    className,
}) => {
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
            <Tooltip placeholder="top" className={className} title={'Editar'}>
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
