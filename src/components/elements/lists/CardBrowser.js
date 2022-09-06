import React, {useEffect, useState} from "react";
import './CardBrowser.css';
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import FormDrawer from "../../elements/drawers/FormDrawer";
import FilterAddForm from "../../elements/forms/inputs/FilterAddForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";
import {BsGrid, BsList} from "react-icons/bs";
import IconButton from "../misc/IconButton";

const CardBrowser = ({
                         label,
                         description,
                         urlFunc,
                         cardFunc,
                         rowFunc = null,
                         buttomLabel = null,
                         buttonIcon,
                         drawerDetailsTitle = "Details",
                         drawerDetailsWidth = 600,
                         detailsFunc = () => {},
                         drawerAddWidth = 600,
                         drawerAddTitle = "New",
                         addFunc = () => {},
                         className,
                         refresh: forceRefresh,
                         defaultLayout="cards"
                     }) => {

    const Content = ({query, onClick, urlFunc, refresh, forceRefresh}) => {

        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(false);
        const [errors, setErrors] = useState(null);
        const [layoutVert, setLayoutVert] = useState(defaultLayout!=="cards");

        useEffect(() => {
                setData(null);
                const url = urlFunc(query)
                setLoading(true);
                let isSubscribed = true
                asyncRemote({url})
                    .then((response) => {
                        if (response && isSubscribed) {
                            setData(response.data);
                        }
                    })
                    .catch((e) => {
                        if (e && isSubscribed) {
                            setErrors(getError(e))
                        }
                    })
                    .finally(() => {
                            if (isSubscribed) {
                                setLoading(false);
                            }
                        }
                    )
                return () => {
                    isSubscribed = false
                }
            }
            , [query, refresh, urlFunc, forceRefresh])

        if (loading) {
            return <CenteredCircularProgress/>
        }

        if (!loading && isEmptyObjectOrNull(data?.grouped)) {
            return <NoData header="There is no data here.">
                <p>Please click create button in the upper right corner.</p>
            </NoData>
        }

        if (!loading && !isEmptyObjectOrNull(data?.grouped))
            return <TuiForm style={{margin: 20, marginTop: 0}}>
                <TuiFormGroup fitHeight={true}>
                    <TuiFormGroupHeader header={label} description={description}/>
                    <TuiFormGroupContent>
                        <TuiFormGroupField>
                            {cardFunc && rowFunc && <div style={{display: "flex", justifyContent: "flex-end", color: "#333"}}>
                                <IconButton onClick={()=>setLayoutVert(false)} selected={!layoutVert}>
                                    <BsGrid size={20}/>
                                </IconButton>
                                <IconButton onClick={()=>setLayoutVert(true)} selected={layoutVert}>
                                    <BsList size={20}/>
                                </IconButton>
                            </div>}
                            <section className={className} style={{display: "flex", flexWrap: "wrap", width: "100%"}}>
                                {!layoutVert && data && cardFunc && cardFunc(data, onClick)}
                                {layoutVert  && data && rowFunc && rowFunc(data, onClick)}
                                {errors && <ErrorsBox errorList={errors}/>}
                            </section>
                        </TuiFormGroupField>
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>
    }

    const Container = ({forceRefresh}) => {

        const [cardId, setCardId] = useState(null);
        const [displayAddForm, setDisplayAddForm] = useState(false);
        const [refresh, setRefresh] = useState(forceRefresh || 0);
        const [query, setQuery] = useState(null);

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
                buttonLabel={buttomLabel}
                buttonIcon={buttonIcon}
                onFilter={handleFilter}
                onAdd={handleOpenAdd}/>

            <Content
                query={query}
                onClick={(id) => setCardId(id)}
                urlFunc={urlFunc}
                refresh={refresh}
                forceRefresh={forceRefresh}
            />

            <FormDrawer
                width={drawerDetailsWidth}
                label={drawerDetailsTitle}
                onClose={handleCloseDetails}
                open={cardId !== null}>
                {cardId && detailsFunc(cardId, handleCloseDetails)}
            </FormDrawer>

            <FormDrawer
                width={drawerAddWidth}
                label={drawerAddTitle}
                onClose={handleCloseAdd}
                open={displayAddForm}>
                {addFunc && buttomLabel && addFunc(handleCloseAdd)}
            </FormDrawer>

        </div>
    }

    return <Container forceRefresh={forceRefresh}/>

}

export default CardBrowser;