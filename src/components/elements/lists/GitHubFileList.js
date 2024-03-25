import {useFetch} from "../../../remote_api/remoteState";
import React, {useState} from "react";
import {listGitHubFiles} from "../../../remote_api/endpoints/github";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {BsFolder, BsFileEarmark, BsFolder2Open} from "react-icons/bs";
import "./GitHubFileList.css";

function Icon({row}) {
    if (row.type === 'dir') {
        if (row.file === '..') {
            return <BsFolder2Open size={25} style={{margin: "2px 10px"}}/>
        }
        return <BsFolder size={25} style={{margin: "2px 10px"}}/>
    } else {
        return <BsFileEarmark size={25} style={{margin: "2px 10px"}}/>
    }
}

export default function GitHubFileList({onSelect}) {

    const [path, setPath] = useState(null)

    const {data, isError, isLoading} = useFetch(
        ["listGitHubFiles", [path]],
        listGitHubFiles(path),
        data => {
            return data
        })

    const handleClick = (row) => {
        if (row.type === 'dir') {
            setPath(row.path)
        } else {
            if (onSelect instanceof Function) {
                onSelect(row)
            }
        }
    }

    if (isLoading) {
        return <CenteredCircularProgress/>
    }
    if (Array.isArray(data)) {
        return data.map((row, index) => {
            return <div onClick={() => handleClick(row)} className="FileRow" key={index}><Icon row={row}/>
                <span>{row.file}</span></div>
        })
    }
    return ""

}