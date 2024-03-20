import React, {useContext} from "react";
import { TuiForm, TuiFormGroup, TuiFormGroupHeader, TuiFormGroupContent } from "../elements/tui/TuiForm";
import ErrorsBox from "../errors/ErrorsBox";
import { getError } from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import IconButton from "../elements/misc/IconButton";
import {AiOutlineInfoCircle} from "react-icons/ai";
import FormDrawer from "../elements/drawers/FormDrawer";
import PropertyField from "../elements/details/PropertyField";
import { ObjectInspector } from "react-inspector";
import Tag from "../elements/misc/Tag";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import { VscTrash } from "react-icons/vsc";
import {useConfirm} from "material-ui-confirm";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import theme from "../../themes/inspector_light_theme";
import JsonChip from "../elements/misc/JsonChip";
import {objectMap} from "../../misc/mappers";
import {useRequest} from "../../remote_api/requestClient";
import {DataContext} from "../AppBox";

function InconsistentMappingChips({mappingCheck}) {
    if(mappingCheck) {
        return <fieldset><legend>Inconsistent mapping</legend>
            {objectMap(mappingCheck, (index, data) => <JsonChip label={index} object={data} key={index}></JsonChip>)}
        </fieldset>
    }
    return ""
}

function ElasticIndicesInfo({showAlert}) {

    const [data, setData] = React.useState({});
    const [mappingCheck, setMappingCheck] = React.useState({});
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [inspected, setInspected] = React.useState(null);
    const [refresh, setRefresh] = React.useState(0);
    const mounted = React.useRef(false);

    const confirm = useConfirm();
    const {request} = useRequest()
    const dataContext = useContext(DataContext)


    React.useEffect(() => {
        mounted.current = true;
        setLoading(true);
        setError(null);

        request({url: "/test/elasticsearch/indices"})
        .then(response => {
            if (mounted.current) {
                setData(response.data);
            }
        })
        .catch(e => {
            if (mounted.current) {
                setError(getError(e));
            }
        })
        .finally(() => {
            if (mounted.current) {
                setLoading(false);
            }
        })

        request({url: "/storage/mapping/check"})
            .then(response => {
                if (mounted.current) {
                    setMappingCheck(response.data);
                }
            })
            .catch(e => {
                if (mounted.current) {
                    setError(getError(e));
                }
            })
            .finally(() => {
                if (mounted.current) {
                    setLoading(false);
                }
            })

        return () => mounted.current = false;
    }, [refresh, dataContext])

    const handleDelete = name => {
        confirm({title: "Do you want to delete this index?", description: "This action can not be undone."})
        .then(async () => {
                try {
                    const response = await request({
                            url: '/storage/index/' + name,
                            method: "delete"
                    })
                    if (response && mounted.current) {
                        setRefresh(Math.random())
                    }
                } 
                catch (e) {
                    showAlert({type: "error", message: e.toString(), hideAfter: 3000})
                }
            }
        ).catch(_=>{})
    }

    const IndexInfoComponent = ({name, index}) => <>
        <div style={{display: "flex", flexDirection: "row", borderBottom: "1px solid rgba(128,128,128,.3)", padding: 3, fontSize: 16, justifyContent: "space-between", alignItems: "center"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <div style={{marginRight: 10}}>{index?.settings?.index?.creation_date ? index.settings.index.creation_date : "Timestamp not provided"}</div>
                <div>{name} </div>
            </div>

            <div style={{display: "flex", flexWrap: "nowrap", alignItems: "center"}}>
                <div>{Object.keys(index?.aliases || {}).length > 0 && Object.keys(index?.aliases || {}).map((item, key) =>
                    <Tag key={key} backgroundColor={index?.head ? "#00c49f": "#d81b60"} color="white">{item}</Tag>
                )}</div>
                <div>{index?.connected ? <Tag backgroundColor="#00c49f" color="white">Connected</Tag> : <Tag backgroundColor="#d81b60" color="white">Not connected</Tag>}</div>
                <IconButton style={{marginRight: 20}} onClick={() => setInspected(name)}>
                    <AiOutlineInfoCircle size={24}/>
                </IconButton>
                <IconButton style={{marginRight: 20}} onClick={() => handleDelete(name)}>
                    <VscTrash size={24}/>
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
                    <InconsistentMappingChips mappingCheck={mappingCheck}/>
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
                                    <ObjectInspector data={data[inspected]?.mappings || {}}
                                                     theme={theme}
                                                     expandLevel={3}/>
                                </TuiFormGroupContent>
                            </TuiFormGroup>
                        </TuiForm>
                    </TabCase>
                    <TabCase id={1}>
                        <TuiForm style={{margin: 20}}>
                            <TuiFormGroup>
                                <TuiFormGroupContent>
                                    <ObjectInspector data={data[inspected]|| {}} theme={theme} expandLevel={5}/>
                                </TuiFormGroupContent>
                            </TuiFormGroup>
                        </TuiForm>

                    </TabCase>
                </Tabs>
            }
        </FormDrawer>
    </>;   
}

export default connect(
    null,
    {showAlert}
)(ElasticIndicesInfo)