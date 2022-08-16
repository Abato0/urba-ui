import React, { useMemo } from 'react'
import { Button, IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashIcon,
} from 'mdi-material-ui'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../utils/states'
import { TipoUsuario } from '../core/input/dateSelect'

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
            {!moradorFlag && (
                <>
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
                            <IconButton onClick={() => onDelete(row.original)}>
                                <TrashIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            )}
        </>
    )
}

export default ActionsCell
