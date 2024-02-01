import {BsStar} from "react-icons/bs";
import {useFetch} from "../../../remote_api/remoteState";
import {BsEmojiFrownFill} from "react-icons/bs";
import BrowserRow from "./rows/BrowserRow";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../../remote_api/requestClient";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {isEmptyObjectOrNull} from "../../../misc/typeChecking";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import {getError} from "../../../remote_api/entrypoint";
import {useState} from "react";
import FormDrawer from "../drawers/FormDrawer";
import NoData from "../misc/NoData";


const TableRows = ({
                       showAlert,
                       dataContext,
                       url,
                       noDataInfo,
                       deleteEndpoint,
                       deploymentTable,
                       icon,
                       drawerDetailsWidth = 600,
                       detailsFunc,
                       listRefresh,
                       descriptionFunc,
                       forceMode
                   }
) => {

    const confirm = useConfirm();
    const {request} = useRequest()
    const [refresh, setRefresh] = useState(0);
    const [cardId, setCardId] = useState(null);

    const {isLoading, data, error} = useFetch(
        [dataContext, [url, refresh, listRefresh]],
        {
            url: url
        },
        data => {
            return data
        }
    )

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    if (error) {
        if (error.status === 404) {
            return <NoData header="Endpoint not found." icon={<BsEmojiFrownFill size={50}/>}>
                <p>Please contact Tracardi Admin for help.</p>
            </NoData>
        } else if (error.status === 402) {
            return <NoData header="This feature requires license." icon={<BsStar size={50}/>}>
                <p>Please contact Tracardi for a license key.</p>
            </NoData>
        }
    }

    if (!data) {
        return <NoData header="There is no data here.">
            <p>{noDataInfo ? noDataInfo : "Please click create button in the upper right corner."}</p>
        </NoData>
    }

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this record?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: deleteEndpoint + id,
                            method: "delete"
                        })
                        setRefresh(refresh + 1)
                    } catch (e) {
                        showAlert({type: "error", message: getError(e)[0].msg, hideAfter: 3000})
                        console.error(e)
                    }
                }
            ).catch(_ => {
        })
    }

    const handleDeploy = async (id) => {
        if (deploymentTable === null) {
            confirm({
                title: "No deployment!",
                description: "This action has no deployment process."
            })
                .then(() => {

                }).catch(_ => {
            })
            return
        }
        try {
            await request({
                url: `/deploy/${deploymentTable}/${id}`,
                method: "get"
            })
            setRefresh(refresh + 1)
        } catch (e) {
            showAlert({type: "error", message: getError(e)[0].msg, hideAfter: 3000})
        }
    }


    const handleUnDeploy = async (id) => {
        confirm({
            title: "Do you want to delete this record from production!",
            description: "This action will delete this record from production and it can not be reverted."
        })
            .then( async () => {
                try {

                    await request({
                        url: `/undeploy/${deploymentTable}/${id}`,
                        method: "GET"
                    })
                    setRefresh(refresh + 1)
                } catch (e) {
                    showAlert({type: "error", message: getError(e)[0].msg, hideAfter: 3000})
                }
            }).catch(_ => {})
    }

    const handleCloseDetails = () => {
        setCardId(null);
        setRefresh(refresh + 1)
    }

    const handleOpenDetails = (id) => {
        setCardId(id)
    }

    function render() {
        if (!isEmptyObjectOrNull(data?.grouped))
            return Object.entries(data?.grouped).map(([category, plugs], index) => {
                return <div className="CardGroup" style={{width: "100%"}} key={index}>
                    <header>{category}</header>
                    <div>
                        {plugs.map((row, subIndex) => {
                            return <BrowserRow key={index + "-" + subIndex}
                                               id={row?.id}
                                               data={row}
                                               status={row?.enabled}
                                               lock={row?.locked}
                                               onClick={handleOpenDetails}
                                               onDelete={handleDelete}
                                               onUnDeploy={handleUnDeploy}
                                               onDeploy={handleDeploy}
                                               deleteEndpoint={deleteEndpoint}
                                               icon={icon}
                                               tags={row.tags}
                                               descriptionFunc={descriptionFunc}
                                               forceMode={forceMode}

                            />
                        })}
                    </div>
                </div>
            })
    }

    return <>
        {render()}
        <FormDrawer
            width={drawerDetailsWidth}
            onClose={handleCloseDetails}
            open={cardId !== null}>
            {cardId && detailsFunc(cardId, handleCloseDetails)}
        </FormDrawer>
    </>

}

export default connect(
    null,
    {showAlert}
)(TableRows)