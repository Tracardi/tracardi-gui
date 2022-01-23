import React, { Fragment } from "react";
import { FixedSizeGrid as Grid } from 'react-window';
import propTypes from 'prop-types';

import "./table.css"

class Table extends React.Component {
  render() {
    const height = this.props.height | 200,
    width = this.props.width | 300,
    rows = this.props.rows,
    rowHeight = this.props.rowHeight | 20,
    columns = this.props.columns,
    columnWidth = this.props.columnWidth | 100;
  
    const Cell = ({ columnIndex, rowIndex, style }) => {
      let label;
        label = `${rows[rowIndex]}, ${columns[columnIndex]}`;
      return (
        <div className="list-item" style={style}>
          {label}
        </div>
      );
    }
  
    return (
      <Fragment>
        <Grid
          height={height}
          width={width}
          columnCount={columns.length}
          columnWidth={columnWidth}
          rowCount={rows.length}
          rowHeight={rowHeight}
        >
          {Cell}
        </Grid>
      </Fragment>
    );
  
  }
}

Table.propTypes = {
  height: propTypes.number,
  width: propTypes.number,
  rows: propTypes.array.isRequired,
  colums: propTypes.array.isRequired,
  columnWidth: propTypes.number,
  rowHeight: propTypes.number
}

export default Table;
