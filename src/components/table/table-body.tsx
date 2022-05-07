import { FC } from 'react'
import { Row, TableBodyPropGetter, TableBodyProps } from 'react-table'
import { COLOR_SECUDARIO } from '../../utils/keys'
import {
    Checkbox,
    colors,
    TableBody,
    TableCell,
    TableRow,
    createStyles,
    makeStyles,
} from '@material-ui/core'

interface IProps {
    getTableBodyProps: (
        propGetter?: TableBodyPropGetter<any> | undefined
    ) => TableBodyProps
    page: any
    prepareRow: (row: Row<any>) => void
}

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '&:hover': {
                // backgroundColor: COLOR_SECUDARIO,
            },
        },
    })
)

const CardTableBody: FC<IProps> = ({ getTableBodyProps, prepareRow, page }) => {
    const classes = useStyles()
    return (
        <TableBody {...getTableBodyProps()}>
            {page.map((row: any, index: number) => {
                prepareRow(row)
                return (
                    <TableRow
                        {...row.getRowProps()}
                        key={index}
                        className={classes.root}
                    >
                        {row.cells.map((cell: any, index: number) => {
                            return (
                                <TableCell
                                    {...cell.getCellProps()}
                                    size="small"
                                    align="center"
                                    key={index}
                                    style={{ fontVariant: 'traditional' }}
                                    // className={classes.root}
                                >
                                    {cell.render('Cell')}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                )
            })}
        </TableBody>
    )
}

export default CardTableBody
