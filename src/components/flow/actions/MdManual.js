import React, {useEffect, useState} from "react";
import MarkdownElement from "../../elements/misc/MarkdownElement";
import "./MdManual.css";
import {apiUrl} from "../../../remote_api/entrypoint";

const MdManual = ({mdFile}) => {

    const [page,setPage] = useState('');

    async function loadMdFile(fileName) {
        try {
            const response = await fetch(apiUrl()+'/manual/en/docs/flow/actions/'+fileName+'.md?'+ Math.random());
            return await response.text();
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
    }, [mdFile])

    return <section className="MdManual"><MarkdownElement text={page} /></section>

}

export default MdManual