import React, {useEffect, useState} from "react";
import MarkdownElement from "../../elements/misc/MarkdownElement";
import "./ManualPage.css";
import TopInfoBar from "../../TopInfoBar";
import Breadcrumps from "../../elements/misc/Breadcrumps";
import MainContent from "../../MainContent";

const ManualPage = ({mdFile}) => {

    const [page,setPage] = useState('');

    async function loadMdFile(fileName) {
        const file = await import(`../../../manual/${fileName}.md`);
        const response = await fetch(file.default);
        return await response.text();
    }

    useEffect(()=> {
        loadMdFile(mdFile).then((text) => {
            setPage( text )
        })
    })

    return <React.Fragment>
        <TopInfoBar>
            <Breadcrumps/>
        </TopInfoBar>
        <div className="ManualPage">
            <MainContent style={{padding:10}}>
                <MarkdownElement text={page} />
            </MainContent>
        </div>
    </React.Fragment>


}

export default ManualPage