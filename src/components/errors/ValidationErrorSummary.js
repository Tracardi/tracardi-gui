import {objectMap} from "../../misc/mappers";
import ErrorBox from "./ErrorBox";

export default function ValidationErrorSummary({errors}) {
    return objectMap(errors, (k, v) => {
        return <ErrorBox key={k}><table>
            <tbody>
            <tr>
                <td><b>Field</b></td>
                <td style={{paddingLeft: 20}}>{k}</td>
            </tr>
            <tr>
                <td><b>Message</b></td>
                <td style={{paddingLeft: 20}}>{v}</td>
            </tr>
            </tbody>
        </table></ErrorBox>
    })
}