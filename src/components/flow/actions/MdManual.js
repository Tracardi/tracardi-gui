import React, {useEffect, useState} from "react";
import MarkdownElement from "../../elements/misc/MarkdownElement";
import "./MdManual.css";
import { asyncRemote } from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";

export async function loadMdFile(fileName, basePath, baseURL=null) {
    try {
        const response = await asyncRemote({
            baseURL: baseURL,
            url: `${basePath}${fileName}.md?${Math.random()}`
        })
        return await response.data;
    } catch (e) {
        return e.toString()
    }
}

const MdManual = ({mdFile, basePath='/manual/en/docs/flow/actions/', baseURL = null, style=null}) => {

    const [page,setPage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        let isMounted = true
        if(mdFile) {
            setLoading(true)
            loadMdFile(mdFile, basePath, baseURL).then((text) => {
                if(isMounted) {
                    setPage( text )
                }
            }).finally(() => {
                setLoading(false)
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