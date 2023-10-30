import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import React, {useState} from "react";
import Button from "../elements/forms/Button";
import {useConfirm} from "material-ui-confirm";
import {getError} from "../../remote_api/entrypoint";
import {showAlert} from "../../redux/reducers/alertSlice";
import {connect} from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {useRequest} from "../../remote_api/requestClient";


function Deployment({showAlert}) {

    const confirm = useConfirm();
    const [progress, setProgress] = useState(false)

    const {request} = useRequest()

    const handleDeploy = () => {
        confirm({
            title: "Do you want to deploy all changes to production?",
            description: "This action can not be undone. All changes made on staging server will be copied to production server."
        })
            .then(async () => {
                    setProgress(true)
                    try {
                        const response = await request({
                            url: '/production/deploy',
                            method: "get"
                        })
                        const type = response?.data?.result?.failures?.length > 0 ? "warning" : "success"
                        showAlert({
                            type,
                            message: `All ${response?.data?.result?.total} changes deployed. ${response?.data?.result?.failures?.length} failures found.`,
                            hideAfter: 3000
                        })
                    } catch (e) {
                        const err = getError(e)
                        showAlert({type: "error", message: err[0].msg, hideAfter: 5000})
                    } finally {
                        setProgress(false)
                    }
                }
            )
    }

    const handleTest = () => {
        confirm({
            title: "Do you want to LINK all changes to production server?",
            description: "This action can be reverted. All changes made on staging server will be linked to " +
                "production server. Beware that from now on all changes on staging server will be automatically " +
                "visible on production."
        })
            .then(async () => {
                    setProgress(true)
                    try {
                        const response = await request({
                            url: '/production/dry-run',
                            method: "get"
                        })

                        const type = response?.data?.acknowledged !== true ? "warning" : "success"
                        showAlert({type, message: `All changes linked.`, hideAfter: 3000})
                    } catch (e) {
                        const err = getError(e)
                        showAlert({type: "error", message: err[0].msg, hideAfter: 5000})
                    } finally {
                        setProgress(false)
                    }
                }
            )
    }

    const handleRevert = () => {
        confirm({
            title: "Do you want to REVERT all changes on production server?",
            description: "This action reverts all changes made on staging server from production server."
        })
            .then(async () => {
                    setProgress(true)
                    try {
                        const response = await request({
                            url: '/production/dry-run/revert',
                            method: "get"
                        })

                        const type = response?.data?.acknowledged !== true ? "warning" : "success"
                        showAlert({type, message: `All changes reverted.`, hideAfter: 3000})
                    } catch (e) {
                        const err = getError(e)
                        showAlert({type: "error", message: err[0].msg, hideAfter: 5000})
                    } finally {
                        setProgress(false)
                    }
                }
            )
    }

    return <><TuiForm style={{margin: '20px'}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header='Deployment'
                                description='Deployment is a process of coping the changes made on staging server to the production server.'/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Test new configuration live on production"
                                   description="You have the ability to transfer configuration settings from a
                                   staging server, which is a testing environment, to the production server,
                                   which is where actual data is processed. This allows you to test the new
                                   configuration on real data. If, during the testing process, you discover
                                   that something is not functioning as expected, you have the option to revert
                                   back to the original production settings, ensuring that your data is not
                                   impacted by any potential issues.">
                    <Button label="Test on production" onClick={handleTest} disabled={progress}/>
                    <Button label="Revert production" onClick={handleRevert} disabled={progress}
                            style={{marginLeft: 10}}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Deploy changes to production"
                                   description="Deployment means copying all the settings from one environment to another.
                                   This effectively makes permanent changes to the production environment.
                                   Once the transfer has taken place and the new settings have been implemented,
                                   it cannot be undone. It is important to exercise caution when making changes
                                   to a production environment, as they can impact the functioning of the systems
                                   and processes relying on it. Before proceeding with this action, it is recommended
                                   to thoroughly test and validate the new settings in a non-production environment
                                   to minimize the risk of potential issues.">
                    <Button label="Deploy to production" onClick={handleDeploy}
                            disabled={progress}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
        <Backdrop
            sx={{ color: '#fff', zIndex: 10 }}
            open={progress}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
}

export default connect(
    null,
    {showAlert}
)(Deployment)