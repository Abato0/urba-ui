import React, { useMemo, useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import { TrashCan as TrashCanIcon } from 'mdi-material-ui'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../../utils/states'
import { ModalConfirmacion } from '../modal/modalConfirmacion'
import { TipoUsuario } from '../input/dateSelect'

interface IProps {
    className?: string
    onDelete: any
    row: Row<any>
}

const ActionsCellDelete: React.FC<IProps> = ({ onDelete, row, className }) => {
    const usuarioState = useRecoilValue(userInfo)

    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)
    const moradorFlag = useMemo(() => {
        if (usuarioState) {
            return usuarioState.tipo_usuario === TipoUsuario.MORADOR
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
            {!moradorFlag && (
                <Tooltip
                    placeholder="top"
                    className={className}
                    title={'Eliminar'}
                >
                    <IconButton
                        // variant="text"
                        color="secondary"
                        //onClick={() => onDelete(row.original)}
                        onClick={() => setOpenModalConfirmacion(true)}
                    >
                        <TrashCanIcon color="primary" />
                    </IconButton>
                </Tooltip>
            )}
        </>
    )
}

export default ActionsCellDelete
