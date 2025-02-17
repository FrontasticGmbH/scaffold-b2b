'use client';

import React, { FC, HTMLAttributes } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import TableHead from './components/table-head';
import TableBody from './components/table-body';
import TableRow from './components/table-row';
import TableCell from './components/table-cell';
import TablePagination from './components/table-pagination';
import TableContainer from './components/table-container';
import './styles/index.css';
import TableHeaderCell from './components/table-header-cell';

const Table: FC<HTMLAttributes<HTMLDivElement>> & {
  Container: typeof TableContainer;
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
  Pagination: typeof TablePagination;
  HeaderCell: typeof TableHeaderCell;
} = ({ className = '', ...props }) => {
  return <div className={classnames('whitespace-pre scrollbar-hide lg:scrollbar-default', className)} {...props} />;
};

Table.Container = TableContainer;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.Pagination = TablePagination;
Table.HeaderCell = TableHeaderCell;

export default Table;
