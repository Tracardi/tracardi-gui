import React, {useEffect, useState} from "react";
import MarkdownElement from "../../elements/misc/MarkdownElement";
import "./MdManual.css";
import { asyncRemote } from "../../../remote_api/entrypoint";

const MdManual = ({mdFile, basePath='/manual/en/docs/flow/actions/'}) => {

    const [page,setPage] = useState('');

    async function loadMdFile(fileName) {
        try {
            const response = await asyncRemote({url: `${basePath}${fileName}.md?${Math.random()}`})
            return await response.data;
        } catch (e) {
            return e.toString()
        }
    }

    useEffect(()=> {
        let isMounted = true
        if(mdFile) {
            loadMdFile(mdFile).then((text) => {
                if(isMounted) {
                    setPage( text )
                }
            })
        }
        return () => { isMounted = false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mdFile])

    return <section className="MdManual"><MarkdownElement text={page} /></section>

}

export default MdManual