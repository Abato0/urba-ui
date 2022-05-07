import {
    colors,
    createStyles,
    makeStyles,
    TableCell,
    TableHead,
    TableRow,
} from '@material-ui/core'
import { FC } from 'react'
import { HeaderGroup } from 'react-table'
import { COLOR_PRIMARIO } from '../../utils/keys'

interface IProps {
    headerGroups: HeaderGroup<any>[]
}
const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            background: COLOR_PRIMARIO,
            color: 'white',
            fontSize: 14,
            fontWeight: 'unset',
            fontFamily: 'Roboto',
        },
    })
)

const TableHeader: FC<IProps> = ({ headerGroups }) => {
    const classes = useStyles()
    return (
        <>
            <TableHead>
                {headerGroups.map((headerGroup, index) => (
                    <TableRow
                        {...headerGroup.getHeaderGroupProps()}
                        key={index}

                        // key={"tableHeader" + ìndex}
                    >
                        {headerGroup.headers.map((column, index) => (
                            <TableCell
                                className={classes.root}
                                align="center"
                                {...column.getHeaderProps()}
                                key={index}
                            >
                                {column.render('Header')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
        </>
    )
}

export default TableHeader
