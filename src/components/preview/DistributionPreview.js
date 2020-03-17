import React, { useState, useEffect } from "react";
import TableTree, {
  Headers,
  Header,
  Rows,
  Row,
  Cell
} from "@atlaskit/table-tree";
import { api } from "../../api";
import {
  items,
  nth,
  swallow,
  sprintf,
  max,
  rescale
} from "../../utils/functional";

function Occurences(props) {
  const range = [0, 1.25 * (max(props.items) / props.count)];
  return (
    <div className="Occurences">
      {items(props.items).map((_, i) => {
        const percent = _[1] / props.count;
        const percentage = sprintf("%0.2f%%", 100 * percent);
        const width = 100 * rescale(percent, range) + "%";
        return (
          <div
            key={i}
            className="Occurences-item"
            title={`${_[1]} (${percentage})`}
          >
            <div className="Occurences-item-fill" style={{ width: width }} />
            <div className="Occurences-item-label">{_[0]}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function DistributionPreview(props) {
  const path = props.path.split("/");
  const field = nth(path, -2);
  const dataset = path[0];
  const [dist, setDist] = useState(null);
  useEffect(
    _ =>
      swallow(
        api
          .getDatasetDimensionDistribution(dataset, field)
          .then(_ => setDist(_))
      ),
    [dataset, field, setDist]
  );

  return (
    <div className="DistributionPreview">
      {!dist ? (
        <span>No distribution available</span>
      ) : (
        <TableTree>
          <Headers>
            <Header width={300}>Metric</Header>
            <Header width={300}>Value</Header>
          </Headers>
          <Rows
            items={Object.entries(dist)}
            render={(row, i) => (
              <Row
                expandLabel="Expand"
                collapseLabel="Collapse"
                itemId={i}
                hasChildren={false}
              >
                <Cell singleLine>{row[0]}</Cell>
                <Cell singleLine>
                  {row[0] === "occurences" ? (
                    <Occurences items={row[1]} count={dist.count} />
                  ) : row[1] === null ? (
                    "N/A"
                  ) : (
                    "" + row[1]
                  )}
                </Cell>
              </Row>
            )}
          />
        </TableTree>
      )}
    </div>
  );
}
