import React from "react";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupHeader,
    TuiFormGroupContent,
    TuiFormGroupField
} from "../elements/tui/TuiForm";
import ErrorsBox from "../errors/ErrorsBox";
import SquareCard from "../elements/lists/cards/SquareCard";
import {HiArrowNarrowRight} from "react-icons/hi";
import NoData from "../elements/misc/NoData";
import FormDrawer from "../elements/drawers/FormDrawer";
import {TextField, Checkbox, FormControlLabel} from "@mui/material";
import Button from "../elements/forms/Button";
import BackgroundTasks from "./BackgroundTasks";


export default function Migrations() {

    const [availableMigrations, setAvailableMigrations] = React.useState(null);
    const [selectedMigration, setSelectedMigration] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [drawerWidth, setDrawerWidth] = React.useState(800);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const mounted = React.useRef(false);

    const MigrationForm = ({selectedMigration, onConfirm}) => {

        const formMounted = React.useRef(false);
        const [schemas, setSchemas] = React.useState(null);
        const [formLoading, setFormLoading] = React.useState(false);
        const [formError, setFormError] = React.useState(null);
        const [customPrefix, setCustomPrefix] = React.useState("");
        const [selectedSchemas, setSelectedSchemas] = React.useState([]);
        const [selectedCustomPrefix, setSelectedCustomPrefix] = React.useState("");
        const [buttonProgress, setButtonProgress] = React.useState(false);
        const [buttonError, setButtonError] = React.useState(null);
        const [warn, setWarn] = React.useState(false);

        React.useEffect(() => {
            formMounted.current = true;
            setFormLoading(true);
            setFormError(null);
            asyncRemote({
                url: `/migration/${selectedMigration}${selectedCustomPrefix ? `?from_prefix=${selectedCustomPrefix}` : ""}`,
                method: "GET"
            })
                .then(response => {
                    if (formMounted.current) {
                        setSchemas(response.data.schemas);
                        setWarn(response.data.warn);
                    }
                    let newSchemas = [];
                    for (let schema of response.data.schemas) {
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

        const handleStartMigration = async () => {
            if (formMounted.current) {
                setButtonError(null);
                setButtonProgress(true);
            }

            try {
                await asyncRemote({
                    url: "/migration",
                    method: "POST",
                    data: {
                        from_version: selectedMigration,
                        from_prefix: selectedCustomPrefix ? selectedCustomPrefix : null,
                        ids: selectedSchemas
                    }
                })

                if(onConfirm instanceof Function) {
                    onConfirm()
                }

            } catch(e) {
                if (formMounted.current) setButtonError(getError(e));
            } finally {
                if (formMounted.current) setButtonProgress(false);
            }
        }

        return <>
            {warn && 
                <div style={{padding: 20, paddingTop: 3, backgroundColor: "#d81b60", color: "white", marginBottom: 10 }}>
                    <h1 style={{fontWeight: 300}}>Warning !!! Migration from version {selectedMigration} has already been completed.
                    </h1>
                    <p>Migrating data twice may lead to data corruption and loss of results you've recently collected.
                        We recommend running migration only once.
                    </p>
                </div>
            }
            <TuiForm style={{margin: 20}}>
                <TuiFormGroup>
                    <TuiFormGroupHeader header={`Configure migration from version ${selectedMigration}`}/>
                    <TuiFormGroupContent>
                        <TuiFormGroupField header="Custom version prefix"
                                           description="If your previous Tracardi version had custom prefix, please
                                           provide it here and click CONFIRM button.
                                           For standard automatic prefix leave it blank.">
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
                        <TuiFormGroupField header="List of indices"
                                           description="List of data indices that will be upgraded to new version. Uncheck the index to ignore it during upgrade."/>
                        {Array.isArray(schemas) && schemas.length > 0 &&
                        schemas.map((schema, index) =>
                                <FormControlLabel
                                    key={index}
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
                        )
                        }
                        {Array.isArray(schemas) && schemas.length === 0 &&
                        <NoData header="No previous version found.">Type custom version prefix is you are certain that there is previous version installed.</NoData>}
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
                    disabled={buttonProgress}
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
                <TuiFormGroupHeader header="Available migrations"
                                    description="Here you can find migrations that are available for current version."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <div style={{margin: 15, display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
                            {error && <ErrorsBox errorList={error}/>}
                            {loading && !availableMigrations && <CenteredCircularProgress/>}
                            {Array.isArray(availableMigrations) && availableMigrations.length > 0 &&
                            availableMigrations.map(migration =>
                                <SquareCard
                                    key={migration}
                                    id={migration}
                                    name={migration}
                                    description={`Migrate from ${migration}`}
                                    onClick={() => {setSelectedMigration(migration); setDrawerOpen(true); setDrawerWidth(800)}}
                                    icon={<HiArrowNarrowRight size={60} color="#666"/>}
                                />)
                            }
                        </div>
                        {Array.isArray(availableMigrations) && availableMigrations.length === 0 &&
                        <NoData header="No migrations were found for current Tracardi version."/>}
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <FormDrawer
            width={drawerWidth}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >
            {selectedMigration && <MigrationForm selectedMigration={selectedMigration} onConfirm={() => {
                setSelectedMigration(null);
                setDrawerWidth(1600)
            }}/>}
            {!selectedMigration && <>
                <div style={{padding:20, backgroundColor: "rgb(0, 200, 83)", color: "white", marginBottom: 10 }}>
                    <h1 style={{fontWeight: 300}}>The upgrade and data migration process has started.
                        <br/>
                        Below there are the background migration task that are currently running.
                    </h1>
                    <p>If you close this window all tasks will be still running until completion. The information on upgrade status can be found in Monitoring/Background Tasks.
                        Please click refresh button if you can't see started tasks - delay may occur depending on
                        Redis and Tracardi Worker setup.</p>
                </div>

                <BackgroundTasks type="upgrade"/>

            </>}
        </FormDrawer>
    </>;
}