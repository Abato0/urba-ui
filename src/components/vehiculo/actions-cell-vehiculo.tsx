import { Button, Tooltip } from '@material-ui/core'
import React, { useMemo } from 'react'
import { Row } from 'react-table'
import { useRecoilValue } from 'recoil'
import { userInfo } from '../../utils/states'
import { TipoUsuario } from '../core/input/dateSelect'

interface IProps {
    className?: string
    onEdit: any
    onDescargar: any
    row: Row
}

const ActionsCellVehiculo: React.FC<IProps> = ({
    onEdit,
    onDescargar,
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

    // const administradorFlag = useMemo(() => {
    //     if (usuarioState) {
    //         return usuarioState.tipo_usuario === TipoUsuario.ADMIN
    //     }
    //     return false
    // }, [usuarioState])
    return (
        <Tooltip className={className} title={'Editar'}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {!moradorFlag && (
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={() => onEdit(row.original)}
                    >
                        Editar
                    </Button>
                )}
                <Button
                    variant="text"
                    color="secondary"
                    onClick={() => onDescargar(row.original)}
                >
                    {/* Descargar */}
                    Visualizar
                </Button>
            </div>
        </Tooltip>
    )
}

export default ActionsCellVehiculo
