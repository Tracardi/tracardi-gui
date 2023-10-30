import TracardiProAvailableServicesList from "../../elements/lists/TracardiProAvailableServicesList";
import FormDrawer from "../../elements/drawers/FormDrawer";
import TracardiProServiceConfigForm from "./form/TracardiProServiceConfigForm";
import React, {useEffect, useState} from "react";
import NoData from "../../elements/misc/NoData";
import {BsCloudCheckFill, BsSearch} from "react-icons/bs";
import Button from "../../elements/forms/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {useDebounce} from "use-debounce";
import './ProServiceList.css';
import {getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import LinearProgress from "@mui/material/LinearProgress";
import MdManual from "../../flow/actions/MdManual";
import {useRequest} from "../../../remote_api/requestClient";


function ServiceCreatedConfirmation({onConfirmed}) {
    return <NoData
        icon={<BsCloudCheckFill size={60}/>}
        header="Service created"
    >
        <p style={{color: "#555"}}>Your service is ready. All the required resources and plugins were added. Please go
            to Resources tab to see the
            data. If additional plugins were required for this resource to work they have been added to the system an
            can be found
            in the workflow editor.</p>
        <Button label="OK" onClick={onConfirmed} style={{margin: 20}}/>
    </NoData>
}

function ServiceForm({selectedService, onCreated, width = "100%"}) {

    const [ready, setReady] = useState(false);

    const handleSubmit = () => {
        if (onCreated instanceof Function) {
            onCreated()
        }
    }

    return <div style={{padding: 20, width: width}}>
        {ready
            ? <ServiceCreatedConfirmation onConfirmed={handleSubmit}/>
            : <TracardiProServiceConfigForm
                service={selectedService}
                onSubmit={() => setReady(true)}
            />
        }
    </div>
}

export default function ProServiceList() {

    const [selectedService, setSelectedService] = useState(null);
    const [listOfServices, setListOfServices] = useState(null);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [width, setWidth] = useState(550);
    const [debouncedSearchTerm] = useDebounce(query, 500);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {request} = useRequest()

    useEffect(() => {
        setLoading(true);
        setError(null);
        request({
            url: `/tpro/available_services?query=${debouncedSearchTerm}&category=${category}`,
            method: "GET",
        }).then((response) => {
            setListOfServices(response.data)
        }).catch((e) => {
            setError(getError(e))
        }).finally(() => {
            setLoading(false);
        })
    }, [debouncedSearchTerm, category])

    const handleServiceAddClick = async (service) => {
        setSelectedService(service)
        if(service?.metadata?.documentation) {
            setWidth(1000)
        } else {
            setWidth(550)
        }
    }

    const handleChange = (value) => {
        setQuery(value)
    }

    return <>
        <TextField label="Search"
                   onChange={(e) => handleChange(e.target.value)}
                   variant="outlined"
                   fullWidth
                   size="small"
                   value={query}
                   style={{marginBottom: 8}}
                   InputProps={{
                       startAdornment: <InputAdornment position="start">
                           <BsSearch size={20}/>
                       </InputAdornment>
                   }}
        />
        <div style={{height: 4, width: "100%"}}>{(loading) && <LinearProgress
            variant={loading ? "indeterminate" : "determinate"}
            sx={{
                height: 3,
                width: "100%",
                position: "relative",

            }}/>}</div>
        <div style={{display: "flex", width: "100%"}}>
            <div style={{flex: "0 220px"}}>
                <h1 style={{
                    fontWeight: "normal",
                    textTransform: "uppercase",
                    fontSize: 13,
                    width: "90%",
                    borderBottom: "1px solid gray"
                }}>Categories</h1>
                <ul className="Categories">
                    <li onClick={() => {
                        setQuery("");
                        setCategory('')
                    }}>All categories
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('database')
                    }}>Databases
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('service')
                    }}>Services
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('queue')
                    }}>Queues
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('messaging')
                    }}>Messaging
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('emailing')
                    }}>E-mailing
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('crm')
                    }}>CRMs
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('marketing automation')
                    }}>Marketing Automation
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('ml')
                    }}>Machine Learning
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('analytics')
                    }}>Analytics
                    </li>
                </ul>
                <h1 style={{
                    fontWeight: "normal",
                    textTransform: "uppercase",
                    fontSize: 13,
                    width: "90%",
                    borderBottom: "1px solid gray"
                }}>Types</h1>
                <ul className="Categories">
                    <li onClick={() => {
                        setQuery("");
                        setCategory('plugin')
                    }}>Plugins
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('resource')
                    }}>Resources
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('microservice')
                    }}>Microservices
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('bridge')
                    }}>Bridges
                    </li>
                    <li onClick={() => {
                        setQuery("");
                        setCategory('destination')
                    }}>Destinations
                    </li>
                </ul>
            </div>
            <div style={{flex: "1"}}>
                {error && <ErrorsBox errorList={error}/>}
                <TracardiProAvailableServicesList
                    services={listOfServices}
                    onServiceClick={handleServiceAddClick}
                />
            </div>
        </div>


        <FormDrawer
            width={width}
            onClose={() => setSelectedService(null)}
            open={selectedService !== null}>
            {selectedService?.metadata?.documentation
                ? <div style={{display: "flex", minHeight: "100%"}}>
                    <div style={{width: 450, backgroundColor: "aliceblue", borderRight: "solid 1px #ddd",}}>
                        <div style={{padding: 20, position: "sticky", top: 0}} ><MdManual
                            mdFile={selectedService?.metadata?.documentation?.file}
                            basePath={selectedService?.metadata?.documentation?.path}
                        /></div>
                    </div>
                    <div style={{width: 550,
                        boxShadow: "0 -1px 11px rgba(0, 0, 0, 0.5)  "
                    }}>
                        <ServiceForm
                            selectedService={selectedService}
                            onCreated={() => setSelectedService(null)}
                        />
                    </div>


                </div>
                : <ServiceForm
                    selectedService={selectedService}
                    onCreated={() => setSelectedService(null)}
                />}
        </FormDrawer></>
}