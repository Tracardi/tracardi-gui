import React from "react";

const Memo = ({children}) => {
    return <>{children}</>
}

export default React.memo(Memo);