import React, { useState, useEffect } from "react";
import ReactDataSheet from "react-datasheet";
import "react-datasheet/lib/react-datasheet.css";

import { api } from "../../api";
import { swallow, head } from "../../utils/functional";

export default function TablePreview(props) {
  const dataset = props.path.split("/", 1)[0];
  const limit = props.limit || 30;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([[]]);
  const [grid, setGrid] = useState([[]]);
  useEffect(_ => setGrid([columns].concat(rows)), [rows, columns]);

  const normalizeRows = rows =>
    rows.map(row =>
      row.map(cell => {
        return { value: cell };
      })
    );
  const normalizeColumns = _ =>
    _.map(_ => {
      return { value: _, readOnly: true };
    });

  useEffect(
    _ =>
      swallow(
        api
          .getDatasetDataPreview(dataset)
          .then(_ => setRows(normalizeRows(head(_, limit))))
      ),
    [dataset, limit]
  );
  useEffect(
    _ =>
      swallow(
        api
          .listDatasetDimensions(dataset)
          .then(_ => setColumns(normalizeColumns(_)))
      ),
    [dataset]
  );

  // SEE: https://github.com/nadbm/react-datasheet
  return (
    <div className="TablePreview">
      {grid.length === 0 ? (
        <div class="TablePreview-empty">No data available</div>
      ) : (
        <ReactDataSheet
          data={grid}
          valueRenderer={cell => cell.value}
          onCellsChanged={changes => {
            // const grid = this.state.grid.map(row => [...row])
            // changes.forEach(({cell, row, col, value}) => {
            //   grid[row][col] = {...grid[row][col], value}
            // })
            // this.setState({grid})
          }}
        />
      )}
    </div>
  );
}
