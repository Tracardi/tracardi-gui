import React, { Fragment } from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import propTypes from 'prop-types';

import "./table.css"

const LOADING = 1;
const LOADED = 2;
let itemStatusMap = {};

const isItemLoaded = index => !!itemStatusMap[index];
const loadMoreItems = (startIndex, stopIndex) => {
  for (let index = startIndex; index <= stopIndex; index++) {
    itemStatusMap[index] = LOADING;
  }
  return new Promise(resolve =>
    setTimeout(() => {
      for (let index = startIndex; index <= stopIndex; index++) {
        itemStatusMap[index] = LOADED;
      }
      resolve();
    }, 2500)
  );
};



class Table extends React.Component {
  render() {
    const height = this.props.height | 200,
    width = this.props.width | 300,
    items = this.props.items,
    itemSize = this.props.itemSize | 35;
  
    const Row = ({ index, style }) => {
      let label;
      if (itemStatusMap[index] === LOADED) {
        label = `${items[index]}`;
      } else {
        label = "Loading...";
      }
      return (
        <div className="list-item" style={style}>
          {label}
        </div>
      );
    }
  
    return (
      <Fragment>
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={1000}
          loadMoreItems={loadMoreItems}
        >
          {({ onItemsRendered, ref }) => (
            <List
              className="List"
              height={height}
              itemCount={items.length}
              itemSize={itemSize}
              onItemsRendered={onItemsRendered}
              ref={ref}
              width={width}
            >
              {Row}
            </List>
          )}
        </InfiniteLoader>
      </Fragment>
    );
  
  }
}

Table.propTypes = {
  height: propTypes.number,
  width: propTypes.number,
  items: propTypes.array.isRequired,
  itemSize: propTypes.number
}

export default Table;
