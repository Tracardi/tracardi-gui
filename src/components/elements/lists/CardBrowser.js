import React, {useEffect, useState} from "react";
import './CardBrowser.css';
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import FormDrawer from "../../elements/drawers/FormDrawer";
import FilterAddForm from "../../elements/forms/inputs/FilterAddForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";

const CardBrowser = ({
                         label,
                         description,
                         urlFunc,
                         cardFunc,
                         buttomLabel = null,
                         buttonIcon,
                         drawerDetailsTitle = "Details",
                         drawerDetailsWidth = 600,
                         detailsFunc = () => {
                         },
                         drawerAddWidth = 600,
                         drawerAddTitle = "New",
                         addFunc = () => {
                         },
                         className,
                         refresh: forceRefresh
                     }) => {

    const [cards, setCards] = useState(null);
    const [cardId, setCardId] = useState(null);
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [refresh, setRefresh] = useState(forceRefresh || 0);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
            setCards(null);
            const url = urlFunc(query)
            setLoading(true);
            let isSubscribed = true
            asyncRemote({url})
                .then((response) => {
                    if (response && isSubscribed) {
                        setCards(response.data);
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

    const onClick = (id) => {
        setCardId(id);
    }

    const closeEdit = (data) => {
        setDisplayAddForm(false);
        setRefresh(refresh + 1);
    }

    const closeDetails = () => {
        setCardId(null);
        setRefresh(refresh + 1);
    }

    const onFilter = (query) => {
        setQuery(query);
    }

    const onAdd = () => {
        setDisplayAddForm(true)
    }

    return <div className="CardBrowser">
        <FilterAddForm
            style={{margin: "0 20px", marginTop: 5}}
            textFieldLabel="Type to filter"
            buttonLabel={buttomLabel}
            buttonIcon={buttonIcon}
            onFilter={onFilter}
            onAdd={onAdd}/>


        <TuiForm style={{margin: 20, marginTop: 0}}>
            <TuiFormGroup fitHeight={true}>
                <TuiFormGroupHeader header={label} description={description}/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <section className={className} style={{display: "flex", flexWrap: "wrap", width: "100%"}}>
                            {loading && <CenteredCircularProgress/>}
                            {cards && cardFunc(cards, onClick)}
                            {errors && <ErrorsBox errorList={errors}/>}
                        </section>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>


        <FormDrawer
            width={drawerDetailsWidth}
            label={drawerDetailsTitle}
            onClose={() => {
                closeDetails();
            }}
            open={cardId !== null}>
            {cardId && detailsFunc(cardId, closeDetails)}
        </FormDrawer>

        {addFunc && buttomLabel && <FormDrawer
            width={drawerAddWidth}
            label={drawerAddTitle}
            onClose={() => {
                closeEdit();
            }}
            open={displayAddForm}>
            {addFunc(closeEdit)}
        </FormDrawer>}

    </div>
}

export default CardBrowser;