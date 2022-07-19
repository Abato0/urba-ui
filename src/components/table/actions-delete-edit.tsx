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
    onInactivar: any,
    onActivar: any,
}

const ActionsCellEditDelete: React.FC<IProps> = ({
    onEdit,
    onDelete,
    onInactivar,
    onActivar,
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
            <Tooltip placeholder="top" className={className} title={'Activar'}>
                <IconButton
                    // variant="text"
                    disabled={
                        row.original.estado === EstadoTagRow.OCUPADO
                        || row.original.estado === EstadoTagRow.INACTIVO
                    }
                    onClick={() => onActivar(row.original)}
                >
                    <AlarmLightIcon color={row.original.estado === EstadoTagRow.OCUPADO
                        || row.original.estado === EstadoTagRow.INACTIVO ? "disabled" : "primary"} />
                </IconButton>
            </Tooltip>
            <Tooltip placeholder="top" className={className} title={'Inactivar'}>
                <IconButton
                    // variant="text"
                    // color="secondary"
                    disabled={row.original.estado === EstadoTagRow.OCUPADO || row.original.estado === EstadoTagRow.DISPONIBLE}
                    onClick={() => onInactivar(row.original)}
                >
                    <AlarmLigthOffIcon color={row.original.estado === EstadoTagRow.OCUPADO
                        || row.original.estado === EstadoTagRow.DISPONIBLE ? "disabled" : "primary"} />
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
