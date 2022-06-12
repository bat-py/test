import classNames from 'classnames';
import { useTable, useFlexLayout, useRowState, useResizeColumns } from 'react-table';
import { Card } from '..';

import styles from './Table.module.scss';

export const Table = ({
  columns = [],
  data = [],
  className,
  Row,
  initialRowState = {},
  centerColumns = [],
  tableBodyClassName,
  rowClassName,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      initialRowStateAccessor: () => initialRowState,
    },
    useResizeColumns,
    useFlexLayout,
    useRowState
  );

  return (
    <Card className={classNames(styles.table__wrapper, className)}>
      <table className={styles.table} {...getTableProps()}>
        <thead className={styles.header}>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(header => {
                return (
                  <th
                    className={classNames(styles.header__column, {
                      [styles['header__column--center']]: centerColumns.includes(header.id),
                    })}
                    {...header.getHeaderProps()}
                  >
                    {header.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody
          className={classNames(styles.table__body, tableBodyClassName)}
          {...getTableBodyProps()}
        >
          {rows.map((row, rowIndex, array) => {
            prepareRow(row);
            if (Row) {
              return (
                <Row {...row.getRowProps()} row={row}>
                  {row.cells.map(cell => (
                    <td className={styles.table__cell} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </Row>
              );
            }
            return (
              <tr
                className={classNames(rowClassName, {
                  [styles['table__last-row']]: rowIndex === array.length - 1,
                })}
                {...row.getRowProps()}
              >
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      className={classNames(styles.table__cell, {
                        [styles['table__first-row']]: rowIndex === 0,
                        [styles['table__cell--center']]: centerColumns.includes(cell.column.id),
                      })}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};
