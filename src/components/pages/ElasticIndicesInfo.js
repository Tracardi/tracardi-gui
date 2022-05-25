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
import Tag from "../elements/misc/Tag";
import Tabs, {TabCase} from "../elements/tabs/Tabs";


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
            <div style={{display: "flex", alignItems: "center"}}>
                <div style={{marginRight: 10}}>{index?.settings?.index?.creation_date ? index.settings.index.creation_date : "Timestamp not provided"}</div>
                <div>{name} </div>
            </div>

            <div style={{display: "flex", flexWrap: "nowrap", alignItems: "center"}}>
                <div>{Object.keys(index?.aliases || {}).length > 0 && <Tag backgroundColor={index?.head ? "#00c49f": "#d81b60"} color="white">{Object.keys(index?.aliases || {}).join(", ")}</Tag>}</div>
                <div>{index?.connected ? <Tag backgroundColor="#00c49f" color="white">Connected</Tag> : <Tag backgroundColor="#d81b60" color="white">Not connected</Tag>}</div>
                <IconButton style={{marginRight: 20}} onClick={() => setInspected(name)}>
                    <AiOutlineInfoCircle size={24}/>
                </IconButton>
            </div>
        </div>
    </>;

    return <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader 
                    header="Elasticsearch indices" 
                    description="Mappings, status and other details of storage indices. Indices connected to Tracardi are tagged as 'Connected'."
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
                <Tabs tabs={["Index details", "Raw data"]}>
                    <TabCase id={0}>
                        <TuiForm style={{margin: 20}}>
                            <TuiFormGroup>
                                <TuiFormGroupContent>
                                    <PropertyField key="name" content={inspected} name="Name"/>
                                    <PropertyField
                                        key="aliases"
                                        content={Object.keys(data[inspected]?.aliases).length > 0 ? <Tag>{ Object.keys(data[inspected]?.aliases).join(", ")}</Tag> : "<no-aliases>"}
                                        name="Aliases"
                                    />
                                    <PropertyField key="uuid" name="UUID" content={data[inspected]?.settings?.index?.uuid || "<no-uuid>"}/>
                                    <PropertyField key="shards" name="Number of shards" content={data[inspected]?.settings?.index?.number_of_shards || "<no-data>"}/>
                                    <PropertyField key="provided_name" name="Provided name" content={data[inspected]?.settings?.index?.provided_name || "<no-data>"}/>
                                    <PropertyField key="replicas" name="Number of replicas" content={data[inspected]?.settings?.index?.number_of_replicas || "<no-data>"}/>
                                </TuiFormGroupContent>
                            </TuiFormGroup>
                            <TuiFormGroup>
                                <TuiFormGroupHeader header="Index mapping" description="Index fields and data types."/>
                                <TuiFormGroupContent>
                                    <ObjectInspector data={data[inspected]?.mappings || {}} expandLevel={3}/>
                                </TuiFormGroupContent>
                            </TuiFormGroup>
                        </TuiForm>
                    </TabCase>
                    <TabCase id={1}>
                        <TuiForm style={{margin: 20}}>
                            <TuiFormGroup>
                                <TuiFormGroupContent>
                                    <ObjectInspector data={data[inspected]|| {}} expandLevel={5}/>
                                </TuiFormGroupContent>
                            </TuiFormGroup>
                        </TuiForm>

                    </TabCase>
                </Tabs>
            }
        </FormDrawer>
    </>;   
}