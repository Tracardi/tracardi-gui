import React, {useEffect, useState} from "react";
import MarkdownElement from "../../elements/misc/MarkdownElement";
import "./MdManual.css";

const MdManual = ({mdFile}) => {

    const [page,setPage] = useState('');

    async function loadMdFile(fileName) {
        const response = await fetch('http://localhost:8001/manual/en/docs/flow/actions/'+fileName+'.md?'+ Math.random());
        return await response.text();
    }

    useEffect(()=> {
        if(mdFile) {
            loadMdFile(mdFile).then((text) => {
                setPage( text )
            })
        }
    })

    return <section className="MdManual"><MarkdownElement text={page} /></section>

}

export default MdManual