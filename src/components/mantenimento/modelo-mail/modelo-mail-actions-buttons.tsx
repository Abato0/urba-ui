import React from 'react'
import { Button, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'

interface IProps {
    className?: string
    onEdit: any
    row: Row
}

const ActionsCellEditDeleteModeloMail: React.FC<IProps> = ({
    onEdit,
    row,
    className,
}) => {
    return (
        <Tooltip className={className} title={'Editar'}>
            <>
                <Button
                    variant="text"
                    color="secondary"
                    onClick={() => onEdit(row.original)}
                >
                    Editar
                </Button>
            </>
        </Tooltip>
    )
}

export default ActionsCellEditDeleteModeloMail
