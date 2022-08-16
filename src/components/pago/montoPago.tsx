import { Row } from 'react-table'
import { Typography } from '@material-ui/core'
import { IDataTablePagoListado } from '../../pages/pago/listado'

interface IProps {
    className?: string

    row: Row<IDataTablePagoListado>
}

const MontoPago: React.FC<IProps> = ({ row, className }) => {
    return (
        <Typography style={{ fontSize: '12px' }}>
            {row.original.monto ? '$ ' + row.original.monto.toFixed(2) : 0}
        </Typography>
    )
}

export default MontoPago
