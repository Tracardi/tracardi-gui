import React, { useState } from "react";
import "./Table.css";
import { Table, Column, Row } from "react-vt-table";
import AutoSizer from "react-virtualized-auto-sizer";

export default function ( { data, children, onClick, ...props}) {
    // function rowRenderer(props) {
    //     const { index, style } = props;
    //     const { getRowWidth, getColumnWidth, children } = props.data.rowProps;
    //
    //     if (true) {
    //         return (
    //             <div
    //                 tabIndex={index}
    //                 key={props.key}
    //                 className="VTRow"
    //             >
    //                 {children.map((child, childIndex) => {
    //                     console.log(child);
    //                     return (
    //                         <div
    //                             className="VTCell"
    //                             style={{ width: getColumnWidth(childIndex) }}
    //                         >
    //                             {data[index][child.props.dataKey]}
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //         );
    //     }
    //
    //     // return <Row {...props} />;
    // }

    const handleClick = (e, data) => {
        if(onClick) {
            onClick(e, data)
        }
    }

    return (
        <AutoSizer>
                {({ width, height }) => (
                    <Table
                        width={width}
                        height={height}
                        data={data}
                        onRowClick={handleClick}
                        {...props}
                    >
                        {children}
                    </Table>
                )}
            </AutoSizer>
    );
}
