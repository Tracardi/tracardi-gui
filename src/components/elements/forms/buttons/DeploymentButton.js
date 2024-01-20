import {DisplayOnlyOnTestContext, RestrictToMode} from "../../../context/RestrictContext";
import Button from "../Button";
import React, {useState} from "react";
import {useRequest} from "../../../../remote_api/requestClient";
import Tag from "../../misc/Tag";
import useTheme from "@mui/material/styles/useTheme";

export default function DeployButton({id, production, running, deplomentTable}) {

    const theme = useTheme()
    const [deployed, setDeployed] = useState(production === true)
    const {request} = useRequest()

    const handleDeploy = async (deploy) => {
        try {
            const response = await request({
                url: deploy ? `/deploy/${deplomentTable}/${id}` : `/undeploy/${deplomentTable}/${id}`,
                method: "get"
            })
            setDeployed(response.data)
        } catch (e) {
            console.error(e)
        }
    }

    return <RestrictToMode mode="commercial">
        <DisplayOnlyOnTestContext>
            {running && <Tag backgroundColor={theme.palette.primary.main} color="white">Running</Tag>}
            {deployed
                ? <Button label="deployed" style={{width: 100}} disabled={true} onClick={()=>handleDeploy(false)}/>
                : !deployed
                    ? <Button label="deploy" style={{width: 100}} onClick={()=>handleDeploy(true)}/>
                    : <Button label="unknown" disabled={true} style={{width: 100}}></Button>}

        </DisplayOnlyOnTestContext>
    </RestrictToMode>
}