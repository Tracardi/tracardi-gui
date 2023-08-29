import React, {useEffect} from "react";
import RuleRow from "../elements/lists/rows/RuleRow";
import {asyncRemote} from "../../remote_api/entrypoint";
import CircularProgress from "@mui/material/CircularProgress";
import { useConfirm } from "material-ui-confirm";

export default function FlowRules({flowName, id, refresh}) {

    const [rules, setRules] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const confirm = useConfirm();

    useEffect(() => {
            setLoading(true);
            let isSubscribed = true
            asyncRemote({
                url: '/rules/by_flow/' + id
            }).then((response) => {
                if (response && isSubscribed) {
                    setRules(response.data)
                }
            }).catch((e) => {
                console.error(e)
            }).finally(() => {
                if(isSubscribed) {
                    setLoading(false);
                }
            })

            return () => {
                isSubscribed = false
            }
        },
        [id, refresh]
    )

    const onDelete = (id, name) => {
        confirm({
            title: `Are you sure you want to delete rule ${name}?`,
            description: "This action cannot be undone."
        })
        .then(() => {
            asyncRemote({
                method: "DELETE",
                url: `/rule/${id}`
            })
            .then(_ => {
                setRules(rules.filter(rule => rule.id !== id));
            })
            .catch(_ => {})
        })
        .catch(() => {})
    }

    const RulesList = ({flow, rules}) => {
        return rules.map((rule, index) => {
            return <RuleRow data={rule} flow={flow} key={index} onDelete={onDelete}/>
        })
    }

    return <div>
        {loading && <CircularProgress/>}
        {!loading && <div className="boxRowUnderlines"><RulesList flow={flowName} rules={rules}/></div>}
    </div>
}