import React from "react";
import { asyncRemote, getError } from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import { TuiForm, TuiFormGroup, TuiFormGroupHeader, TuiFormGroupContent, TuiFormGroupField } from "../elements/tui/TuiForm";
import ErrorsBox from "../errors/ErrorsBox";
import SquareCard from "../elements/lists/cards/SquareCard";
import {HiArrowNarrowRight} from "react-icons/hi";
import NoData from "../elements/misc/NoData";
import FormDrawer from "../elements/drawers/FormDrawer";
import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import Button from "../elements/forms/Button";
import {useConfirm} from "material-ui-confirm";



export default function Migrations() {

    const [availableMigrations, setAvailableMigrations] = React.useState(null);
    const [selectedMigration, setSelectedMigration] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const mounted = React.useRef(false);
    const confirm = useConfirm();

    const MigrationForm = ({ selectedMigration, onConfirm }) => {

        const formMounted = React.useRef(false);
        const [schemas, setSchemas] = React.useState(null);
        const [formLoading, setFormLoading] = React.useState(false);
        const [formError, setFormError] = React.useState(null);
        const [customPrefix, setCustomPrefix] = React.useState("");
        const [selectedSchemas, setSelectedSchemas] = React.useState([]);
        const [selectedCustomPrefix, setSelectedCustomPrefix] = React.useState("");
        const [buttonProgress, setButtonProgress] = React.useState(false);
        const [buttonError, setButtonError] = React.useState(null);

        React.useEffect(() => {
            formMounted.current = true;
            setFormLoading(true);
            setFormError(null);
            asyncRemote({
                url: `/migration/${selectedMigration}${selectedCustomPrefix ? `?from_prefix=${selectedCustomPrefix}` : ""}`,
                method: "GET"
            })
            .then(response => {
                if (formMounted.current) setSchemas(response.data);
                let newSchemas = [];
                for (let schema of response.data) {
                    newSchemas.push(schema.id);
                }
                if (formMounted.current) setSelectedSchemas(newSchemas);
            })
            .catch(e => {
                if (formMounted.current) setFormError(getError(e));
            })
            .finally(() => {
                if (formMounted.current) setFormLoading(false);
            })
            return () => formMounted.current = false;
        }, [selectedMigration, selectedCustomPrefix])

        const handleStartMigration = () => {
            if (formMounted.current) {
                setButtonError(null);
                setButtonProgress(true);
            }
            asyncRemote({
                url: "/migration",
                method: "POST",
                data: {
                    from_version: selectedMigration,
                    from_prefix: selectedCustomPrefix ? selectedCustomPrefix : null,
                    ids: selectedSchemas
                }
            })
            .then(response => {
                confirm({
                    title: "Started migrations:", 
                    description: <>{response.data.started_migrations.map(element => <div>- {element[0]}</div>)}</>,
                    cancellationText: null
                })
                .then(onConfirm)
            })
            .catch(e => {
                if (formMounted.current) setButtonError(getError(e));
            })
            .finally(() => {
                if (formMounted.current) setButtonProgress(false);
            })
        }

        return <> 
            <TuiForm style={{margin: 20}}>
                <TuiFormGroup>
                    <TuiFormGroupHeader header={`Configure migration from version ${selectedMigration}`} />
                    <TuiFormGroupContent>
                        <TuiFormGroupField header="Custom version prefix" description="If your previous Tracardi version had custom prefix set while setup, please provide it here and confirm it with the button below.">
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <TextField
                                    placeholder="Custom prefix"
                                    size="small"
                                    onChange={e => setCustomPrefix(e.target.value)}
                                    value={customPrefix}
                                    fullWidth
                                />
                                <Button 
                                    label="Confirm"
                                    onClick={() => setSelectedCustomPrefix(customPrefix)}
                                />
                            </div>
                        </TuiFormGroupField>
                        <TuiFormGroupField header="Indices migration schemas" description="Here are migration schemas for selected version. If you do not want to migrate some index (ignore it), you can just uncheck it."/>
                        {Array.isArray(schemas) && schemas.length > 0 && 
                                schemas.map((schema, index) => 
                                    <TuiFormGroupField key={index}>
                                        <FormControlLabel 
                                            style={{padding: 10}} 
                                            control={
                                                <Checkbox 
                                                    size="medium" 
                                                    checked={selectedSchemas.includes(schema.id)} 
                                                    onChange={() => {
                                                        if (selectedSchemas.includes(schema.id)) {
                                                            setSelectedSchemas(selectedSchemas.filter(element => element !== schema.id))
                                                        } else {    
                                                            setSelectedSchemas([...selectedSchemas, schema.id])
                                                        }
                                                    }}
                                                />
                                            } 
                                            label={`${schema.copy_index.from_index} to ${schema.copy_index.to_index}`}
                                        />
                                    </TuiFormGroupField>
                                )
                        }
                        {Array.isArray(schemas) && schemas.length === 0 && <NoData header="No indices were found for given prefix."/> }
                        {formError && <ErrorsBox errorList={formError}/>}
                        {buttonError && <ErrorsBox errorList={buttonError}/>}
                        {formLoading && !schemas && <div style={{height: "auto"}}><CenteredCircularProgress/></div>}
                    </TuiFormGroupContent>
                </TuiFormGroup>
                {selectedSchemas.length > 0 && 
                    <Button 
                        label="Start migration"
                        onClick={handleStartMigration}
                        progress={buttonProgress}
                        error={!!buttonError}
                    />
                }   
            </TuiForm>
        </>
    }

    React.useEffect(() => {
        mounted.current = true;
        setLoading(true);
        setError(null);
        asyncRemote({
            url: "/migrations",
            method: "GET"
        })
        .then(response => {
            if (mounted.current) setAvailableMigrations(response.data);
        })
        .catch(e => {
            if (mounted.current) setError(getError(e));
        })
        .finally(() => {
            if (mounted.current) setLoading(false);
        })
        return () => mounted.current = false;
    }, [])

    return <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Available migrations" description="Here you can find migrations that are available for current version." />
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <div style={{margin: 15, display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                            {error && <ErrorsBox errorList={error} />}
                            {loading && !availableMigrations && <CenteredCircularProgress />}
                            {Array.isArray(availableMigrations) && availableMigrations.length > 0 &&
                                availableMigrations.map(migration =>
                                    <SquareCard
                                        key={migration}
                                        id={migration}
                                        name={migration}
                                        description={`Migrate from ${migration}`}
                                        onClick={() => setSelectedMigration(migration)}
                                        icon={<HiArrowNarrowRight size={60} color="#666"/>}
                                    />)
                            }
                            {Array.isArray(availableMigrations) && availableMigrations.length === 0 && <NoData header="No migrations were found for current Tracardi version."/>}
                        </div>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <FormDrawer
            width={800}
            open={!!selectedMigration}
            onClose={() => setSelectedMigration(null)}
        >
            <MigrationForm selectedMigration={selectedMigration} onConfirm={() => setSelectedMigration(null)}/>
        </FormDrawer>
    </>;
}