import { IconButton, Tooltip } from '@material-ui/core'
import { FC, useMemo, useState } from 'react'
import { Row } from 'react-table'
import { useRecoilValue } from 'recoil'
import { IVisianteNormalize } from '../../pages/visitantes/listado-visitante'
import { userInfo } from '../../utils/states'
import { TipoUsuario } from '../core/input/dateSelect'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashIcon,
} from 'mdi-material-ui'
import { isNotNilOrEmpty } from '../../utils/is-nil-empty'
interface IProps {
    className?: string
    onEdit: any
    onDelete: any
    row: Row<IVisianteNormalize>
}

const ActionsCellMorador: FC<IProps> = ({
    onDelete,
    onEdit,
    row,
    className,
}) => {
    const usuarioState = useRecoilValue(userInfo)

    const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)

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

    const editarVisitante = useMemo(() => {
        if (row.original) {
            // console.log("Fecha:Salid: ", row)
            return isNotNilOrEmpty(row.original.fecha_llegada)
        }
        return false
    }, [row])

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
                <>
                    {editarVisitante && (
                        <Tooltip
                            className={className}
                            placement="right"
                            title={'Editar'}
                        >
                            <IconButton onClick={() => onEdit(row.original)}>
                                <FileEditIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {administradorFlag && (
                        <Tooltip
                            className={className}
                            placement="right"
                            title={'Eliminar'}
                        >
                            <IconButton
                                onClick={() => setOpenModalConfirmacion(true)}
                                //onClick={() => onDelete(row.original)}
                            >
                                <TrashIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            )}
        </>
    )
}

export default ActionsCellMorador
