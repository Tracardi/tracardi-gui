import React, {useEffect, useState} from "react";
import MarkdownElement from "../../elements/misc/MarkdownElement";
import "./MdManual.css";

const MdManual = ({mdFile}) => {

    const [page,setPage] = useState('');

    async function loadMdFile(fileName) {
        const response = await fetch(window._env_.API_URL+'/manual/en/docs/flow/actions/'+fileName+'.md?'+ Math.random());
        return await response.text();
    }

    useEffect(()=> {
        if(mdFile) {
            loadMdFile(mdFile).then((text) => {
                setPage( text )
            })
        }
    }, [mdFile])

    return <section className="MdManual"><MarkdownElement text={page} /></section>

}

export default MdManual