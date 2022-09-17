import React, { useMemo, useState } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Row } from 'react-table'
import {
    FileEdit as FileEditIcon,
    TrashCan as TrashIcon,
    CardAccountDetails as CardAccountDetailsIcon,
} from 'mdi-material-ui'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../utils/states'
import { TipoUsuario } from '../core/input/dateSelect'
import { IVisianteNormalize } from '../../pages/visitantes/listado-visitante'
import { HumanGreeting } from 'mdi-material-ui'
import { isNilOrEmpty, isNotNilOrEmpty } from '../../utils/is-nil-empty'
import { ModalConfirmacion } from '../core/modal/modalConfirmacion'

interface IProps {
    className?: string
    onEdit: any
    onSalida: any
    onDelete: any
    row: Row<IVisianteNormalize>
}

const ActionsCellVisitante: React.FC<IProps> = ({
    onEdit,
    onSalida,
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

    const llegadaVisitante = useMemo(() => {
        if (row.original) {
            console.log('Row: ', row.original)
            return (
                isNotNilOrEmpty(row.original.identificacion_visitante) &&
                isNotNilOrEmpty(row.original.fecha_llegada) &&
                isNilOrEmpty(row.original.fecha_salida)
            )
        }
        return false
    }, [row.original])

    const editarVisitante = useMemo(() => {
        if (row.original) {
            // console.log("Fecha:Salid: ", row)
            return isNotNilOrEmpty(row.original.fecha_salida)
        }
        return false
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                {!moradorFlag && (
                    <>
                        {!editarVisitante && (
                            <Tooltip
                                className={className}
                                placement="right"
                                title={'Ingreso'}
                            >
                                <IconButton
                                    onClick={() => onEdit(row.original)}
                                >
                                    <CardAccountDetailsIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        )}

                        {llegadaVisitante && (
                            <Tooltip
                                className={className}
                                placement="right"
                                title={'Salida Visitante'}
                            >
                                <IconButton
                                    onClick={() => onSalida(row.original)}
                                >
                                    <HumanGreeting color="primary" />
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
                                    onClick={() =>
                                        setOpenModalConfirmacion(true)
                                    }
                                    // onClick={() => onDelete(row.original)}
                                >
                                    <TrashIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default ActionsCellVisitante
