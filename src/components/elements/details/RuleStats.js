import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import Properties from "./DetailProperties";

export default function RuleStats({id}) {

    const [stats, setStats] = useState(false);

    useEffect(() => {
            request({
                    url: "/rule/stats/" + id,
                    method: "get"
                },
                () => {},
                () => {},
                (response) => {
                    setStats(response.data);
                }
            );
        },
        []
    )

    return <React.Fragment>
        {stats && <div>
            <Properties properties={stats}/>
        </div>}
    </React.Fragment>
}