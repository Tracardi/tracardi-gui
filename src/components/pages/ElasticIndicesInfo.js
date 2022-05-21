import React from "react";
import { TuiForm, TuiFormGroup, TuiFormGroupHeader, TuiFormGroupContent } from "../elements/tui/TuiForm";
import ErrorsBox from "../errors/ErrorsBox";
import { asyncRemote, getError } from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import IconButton from "../elements/misc/IconButton";
import {AiOutlineInfoCircle} from "react-icons/ai";
import FormDrawer from "../elements/drawers/FormDrawer";
import PropertyField from "../elements/details/PropertyField";
import { ObjectInspector } from "react-inspector";


export default function ElasticIndicesInfo() {

    const [data, setData] = React.useState({});
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [inspected, setInspected] = React.useState(null);

    React.useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setLoading(true);
            setError(null);
        }
        asyncRemote({url: "/test/elasticsearch/indices"})
        .then(response => {
            if (isSubscribed) {
                setData(response.data);
            }
        })
        .catch(e => {
            if (isSubscribed) {
                setError(getError(e));
            }
        })
        .finally(() => {
            if (isSubscribed) {
                setLoading(false);
            }
        })
        return () => isSubscribed = false;
    }, [])

    const IndexInfoComponent = ({name, index}) => <>
        <div style={{display: "flex", flexDirection: "row", borderBottom: "1px solid lightgrey", padding: 3, fontSize: 16, justifyContent: "space-between", alignItems: "center"}}>
            <div style={{width: 400}}>{name}</div>
            <div style={{width: 200}}>{index?.connected ? "Connected" : "Not connected"}</div>
            <div style={{width: 300}}>{index?.settings?.index?.creation_date ? index.settings.index.creation_date : "Timestamp not provided"}</div>
            <IconButton style={{marginRight: 20}} onClick={() => setInspected(name)}>
                <AiOutlineInfoCircle size={24}/>
            </IconButton>
        </div>
    </>;

    return <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader 
                    header="Elasticsearch indices" 
                    description="Here you can check mappings, status and other details of existent Elasticsearch indices. You can also check which indices are connected to Tracardi."
                />
                <TuiFormGroupContent>
                    {
                        loading ? 
                            <CenteredCircularProgress />
                        :
                            error ? 
                                <ErrorsBox errorList={error} />
                            :
                                <>{
                                    Object.keys(data).map(index => <IndexInfoComponent key={data[index]?.settings?.uuid || index} index={data[index]} name={index}/>)
                                }</>
                    }
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <FormDrawer width={800} open={inspected !== null} onClose={() => setInspected(null)}>
            {
                inspected && 
                <TuiForm style={{margin: 20}}>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Index details" description="Here you can check details for selected index."/>
                        <TuiFormGroupContent>
                            <PropertyField key="name" content={inspected} name="Name"/>
                            <PropertyField 
                                key="aliases" 
                                content={Object.keys(data[inspected]?.aliases).length > 0 ? Object.keys(data[inspected]?.aliases).join(", ") : "<no-aliases>"} 
                                name="Aliases"
                            />
                            <PropertyField key="uuid" name="UUID" content={data[inspected]?.settings?.index?.uuid || "<no-uuid>"}/>
                            <PropertyField key="shards" name="Number of shards" content={data[inspected]?.settings?.index?.number_of_shards || "<no-data>"}/>
                            <PropertyField key="provided_name" name="Provided name" content={data[inspected]?.settings?.index?.provided_name || "<no-data>"}/>
                            <PropertyField key="replicas" name="Number of replicas" content={data[inspected]?.settings?.index?.number_of_replicas || "<no-data>"}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Index mapping" description="Here you can check mapping of selected index."/>
                        <TuiFormGroupContent>
                            <ObjectInspector data={data[inspected]?.mappings || {}} expandLevel={3}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Raw index object" description="Here you can check raw index object."/>
                        <TuiFormGroupContent>
                            <ObjectInspector data={data[inspected]|| {}} expandLevel={5}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
            }
        </FormDrawer>
    </>;   
}