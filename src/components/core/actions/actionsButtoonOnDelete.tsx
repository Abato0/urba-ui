import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {

    TrashCan as TrashCanIcon,

} from 'mdi-material-ui'

interface IProps {
    className?: string
    onDelete: any
    row: Row<any>,
}

const ActionsCellDelete: React.FC<IProps> = ({
    onDelete,
    row,
    className,
}) => {

    return (
        <>

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

export default ActionsCellDelete
