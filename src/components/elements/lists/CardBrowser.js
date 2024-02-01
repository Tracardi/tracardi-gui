import React, {useContext, useState} from "react";
import './CardBrowser.css';
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import FormDrawer from "../../elements/drawers/FormDrawer";
import FilterAddForm from "../../elements/forms/inputs/FilterAddForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";
import {BsGrid, BsList} from "react-icons/bs";
import IconButton from "../misc/IconButton";
import {BsStar} from "react-icons/bs";
import envs from "../../../envs";
import {useFetch} from "../../../remote_api/remoteState";
import { BsEmojiFrownFill } from "react-icons/bs";
import {DataContext} from "../../AppBox";

const Content = ({data, error, label, description, onClick, cardFunc, rowFunc, defaultLayout, className, noDataInfo}) => {

    const [layoutVert, setLayoutVert] = useState(defaultLayout !== "cards");

    console.log(data)

    if(error) {
        if(error.status === 404) {
            return <NoData header="Endpoint not found." icon={<BsEmojiFrownFill size={50}/>}>
                <p>Please contact Tracardi Admin for help.</p>
            </NoData>
        } else if(error.status === 402) {
            return <NoData header="This feature requires license." icon={<BsStar size={50}/>}>
                <p>Please contact Tracardi for a license key.</p>
            </NoData>
        }
    }

    if(!data) {
        return <NoData header="There is no data here.">
            <p>{noDataInfo ? noDataInfo : "Please click create button in the upper right corner."}</p>
        </NoData>
    }

    if (!isEmptyObjectOrNull(data?.grouped))
        return <TuiForm style={{margin: 20, marginTop: 0}}>
            <TuiFormGroup fitHeight={true}>
                <TuiFormGroupHeader header={label} description={description}/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        {cardFunc && rowFunc &&
                            <div style={{display: "flex", justifyContent: "flex-end", color: "#333"}}>
                                <IconButton onClick={() => setLayoutVert(false)} selected={!layoutVert}>
                                    <BsGrid size={20}/>
                                </IconButton>
                                <IconButton onClick={() => setLayoutVert(true)} selected={layoutVert}>
                                    <BsList size={20}/>
                                </IconButton>
                            </div>}
                        <section className={className} style={{display: "flex", flexWrap: "wrap", width: "100%"}}>
                            {!layoutVert && data && cardFunc && cardFunc(data, onClick)}
                            {layoutVert && data && rowFunc && rowFunc(data, onClick)}
                        </section>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>

    return ""
}

const CardBrowser = ({
                       label,
                       description,
                       urlFunc,
                       cardFunc,
                       rowFunc = null,
                       buttonLabel = null,
                       buttonIcon,
                       drawerDetailsWidth = 600,
                       detailsFunc = () => {},
                       drawerAddWidth = 600,
                       addFunc = () => {},
                       className,
                       refresh: forceRefresh,
                       defaultLayout = "cards",
                       noDataInfo,
                   }) => {

    const [cardId, setCardId] = useState(null);
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [refresh, setRefresh] = useState(forceRefresh || 0);
    const [query, setQuery] = useState(null);

    const context = useContext(DataContext)
    const dataContext = `${label}-${context ? "production" : "test"}`

    const {isLoading, data, error} = useFetch(
        [dataContext, [query, refresh, urlFunc, forceRefresh]],
        {
            url: urlFunc(query)
        },
        data => {
            return data
        }, {
            fetchPolicy: "no-cache"
        }
    )

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    const handleFilter = (query) => {
        setQuery(query);
    }

    const handleCloseAdd = () => {
        setDisplayAddForm(false);
        setRefresh(refresh + 1);
    }

    const handleOpenAdd = () => {
        setDisplayAddForm(true)
    }

    const handleCloseDetails = () => {
        setCardId(null);
        setRefresh(refresh + 1);
    }

    return <div className="CardBrowser">

        <FilterAddForm
            style={{margin: "0 20px", marginTop: 5}}
            textFieldLabel="Type to filter"
            buttonLabel={buttonLabel || "Add"}
            buttonIcon={buttonIcon}
            onFilter={handleFilter}
            onAdd={handleOpenAdd}
            disableNewButton={!envs.allowUpdatesOnProduction}
        />

        <Content
            data={data}
            error={error}
            label={label}
            description = {description}
            onClick={(id) => setCardId(id)}
            cardFunc={cardFunc}
            rowFunc={rowFunc}
            defaultLayout={defaultLayout}
            className={className}
            noDataInfo={noDataInfo}
        />

        <FormDrawer
            width={drawerDetailsWidth}
            onClose={handleCloseDetails}
            open={cardId !== null}>
            {cardId && detailsFunc(cardId, handleCloseDetails)}
        </FormDrawer>

        <FormDrawer
            width={drawerAddWidth}
            onClose={handleCloseAdd}
            open={displayAddForm}>
            {addFunc && buttonLabel && addFunc(handleCloseAdd)}
        </FormDrawer>

    </div>
}

export default CardBrowser;