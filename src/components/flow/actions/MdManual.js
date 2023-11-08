import React, {useEffect, useState} from "react";
import MarkdownElement from "../../elements/misc/MarkdownElement";
import "./MdManual.css";
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import {useRequest} from "../../../remote_api/requestClient";

const MdManual = ({mdFile, basePath='/manual/en/docs/flow/actions/', baseURL = null, style=null}) => {

    const [page,setPage] = useState('');
    const [loading, setLoading] = useState(false);

    const {request} = useRequest()

    useEffect(()=> {
        let isMounted = true
        if(mdFile) {
            setLoading(true)

            request({
                baseURL: baseURL,
                url: `${basePath}${mdFile}.md?${Math.random()}`
            }).then((response) => {
                if(isMounted) {
                    setPage( response.data )
                }
            }).finally(() => {
                if(isMounted) {
                    setLoading(false)
                }
            })
        }
        return () => { isMounted = false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mdFile, basePath, baseURL])

    return <section className="MdManual" style={style}>
        {loading && <CenteredCircularProgress/>}
        {!loading && page && <MarkdownElement text={page} />}
    </section>

}

export default MdManual