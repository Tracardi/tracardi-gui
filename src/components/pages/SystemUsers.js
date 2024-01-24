import React, {useCallback, useEffect, useRef, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {useConfirm} from "material-ui-confirm";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import {BsPerson} from "react-icons/bs";
import {useRequest} from "../../remote_api/requestClient";
import EditUserForm from "../elements/forms/EditUserForm";
import NewUserForm from "../elements/forms/NewUserForm";


export default function Reports() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc = useCallback((query) => ('/users' + ((query) ? "?query=" + query : "")), []);
    const addFunc = useCallback((close) => <NewUserForm onSubmit={close}/>, []);
    const detailsFunc = useCallback((id, close) => <EditUserForm id={id} onSubmit={close}/>, [])

    const confirm = useConfirm();
    const {request} = useRequest()

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, [])

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this user?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        const response = await request({
                            url: `/user/${id}`,
                            method: "delete"
                        })

                        if (response && mounted.current) {
                            setRefresh(Math.random())
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            ).catch(_=>{})
    }

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, name: row.full_name, icon: "profile"}}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                           status={row.enabled}
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        label="Users"
        description="ist of users registered in the system."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New user"
        buttonIcon={<BsPerson size={20}/>}
        drawerDetailsWidth={600}
        detailsFunc={detailsFunc}
        drawerAddTitle="New user"
        drawerAddWidth={600}
        addFunc={addFunc}
        refresh={refresh}
        defaultLayout="rows"
    />
}
