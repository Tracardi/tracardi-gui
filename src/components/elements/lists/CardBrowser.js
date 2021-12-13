import React, {useEffect, useState} from "react";
import './CardBrowser.css';
import {request} from "../../../remote_api/uql_api_endpoint";
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import FormDrawer from "../../elements/drawers/FormDrawer";
import FilterAddForm from "../../elements/forms/inputs/FilterAddForm";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";

const CardBrowser = ({
                         label,
                         description,
                         urlFunc,
                         cardFunc,
                         buttomLabel = null,
                         buttonIcon,
                         drawerDetailsTitle = "Details",
                         drawerDetailsWidth = 600,
                         detailsFunc = () => {},
                         drawerAddWidth = 600,
                         drawerAddTitle = "New",
                         addFunc = () => {},
                         className
                     }) => {

    const [cards, setCards] = useState(null);
    const [cardId, setCardId] = useState(null);
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [refresh, setRefresh] = useState(Math.random);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        setCards(null);
        setLoading(true);
        const url = urlFunc(query)

        request({
                url
            },
            setLoading,
            (e) => {
                if (e) {
                    setErrors(e)
                }
            },
            (response) => {
                if (response) {
                    setCards(response.data);
                }
            }
        )
    }, [query, refresh, urlFunc])

    const onClick = (id) => {
        setCardId(id);
    }

    const closeEdit = (data) => {
        setDisplayAddForm(false);
        setRefresh(Math.random());
    }

    const closeDetails = () => {
        setCardId(null);
        setRefresh(Math.random());
    }

    const onFilter = (query) => {
        setQuery(query);
    }

    const onAdd = () => {
        setDisplayAddForm(true)
    }

    return <div className="CardBrowser">
        <FilterAddForm
            style={{margin: "10px 20px"}}
            textFieldLabel="Type to filter"
            buttonLabel={buttomLabel}
            buttonIcon={buttonIcon}
            onFilter={onFilter}
            onAdd={onAdd}/>


        <TuiForm style={{margin: 20, width: "calc(100% - 40px)", height: "calc(100% - 50px)"}}>
            <TuiFormGroup fitHeight={true}>
                <TuiFormGroupHeader header={label} description={description}/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <section className={className} style={{display: "flex",flexWrap: "wrap", width: "100%"}}>
                            {loading && <CenteredCircularProgress/>}
                            {cards && cardFunc(cards, onClick)}
                            {errors && <ErrorsBox errorList={errors}/> }
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