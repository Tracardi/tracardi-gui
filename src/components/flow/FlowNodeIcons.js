import {BiGitRepoForked} from "@react-icons/all-files/bi/BiGitRepoForked";
import React from "react";
import {VscRunAll} from "@react-icons/all-files/vsc/VscRunAll";
import {VscJson} from "@react-icons/all-files/vsc/VscJson";
import {FiDatabase} from "@react-icons/all-files/fi/FiDatabase";
import {VscSymbolEvent} from "@react-icons/all-files/vsc/VscSymbolEvent";
import {BsDiamond} from "@react-icons/all-files/bs/BsDiamond";
import {AiOutlineApi} from "@react-icons/all-files/ai/AiOutlineApi";
import {AiOutlineSisternode} from "@react-icons/all-files/ai/AiOutlineSisternode";
import {MdTimelapse} from "@react-icons/all-files/md/MdTimelapse";
import {BiTimeFive} from "@react-icons/all-files/bi/BiTimeFive";
import {AiOutlineFieldTime} from "@react-icons/all-files/ai/AiOutlineFieldTime";
import {FiMapPin} from "@react-icons/all-files/fi/FiMapPin";
import {TiTimes} from "@react-icons/all-files/ti/TiTimes";
import {BiMessageRoundedError} from "@react-icons/all-files/bi/BiMessageRoundedError";
import {BiMessageRoundedCheck} from "@react-icons/all-files/bi/BiMessageRoundedCheck";
import {BiMessageRoundedX} from "@react-icons/all-files/bi/BiMessageRoundedX";
import {FiAlertTriangle} from "@react-icons/all-files/fi/FiAlertTriangle";
import {AiOutlineAlert} from "@react-icons/all-files/ai/AiOutlineAlert";
import {FaRegDotCircle} from "@react-icons/all-files/fa/FaRegDotCircle";
import {IoIosAttach} from "@react-icons/all-files/io/IoIosAttach";
import {RiIncreaseDecreaseLine} from "@react-icons/all-files/ri/RiIncreaseDecreaseLine";
import {IoCloudOutline} from "@react-icons/all-files/io5/IoCloudOutline";
import {TiWeatherSunny} from "@react-icons/all-files/ti/TiWeatherSunny";
import {TiFlowSwitch} from "@react-icons/all-files/ti/TiFlowSwitch";
import {VscCircuitBoard} from "@react-icons/all-files/vsc/VscCircuitBoard";
import {VscRemove} from "@react-icons/all-files/vsc/VscRemove";
import {VscAdd} from "@react-icons/all-files/vsc/VscAdd";
import {VscArrowDown} from "@react-icons/all-files/vsc/VscArrowDown";
import {VscArrowUp} from "@react-icons/all-files/vsc/VscArrowUp";
import {VscDebugStop} from "@react-icons/all-files/vsc/VscDebugStop";
import {VscDebugStart} from "@react-icons/all-files/vsc/VscDebugStart";
import {BsPerson} from "@react-icons/all-files/bs/BsPerson";
import {VscDebugAlt2} from "@react-icons/all-files/vsc/VscDebugAlt2";
import {VscCompareChanges} from "@react-icons/all-files/vsc/VscCompareChanges";
import {RiScissorsCutFill} from "@react-icons/all-files/ri/RiScissorsCutFill";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscGitMerge} from "@react-icons/all-files/vsc/VscGitMerge";
import {VscOrganization} from "@react-icons/all-files/vsc/VscOrganization";

export default function FlowNodeIcons({icon}) {

    const defaultIcon = <VscRunAll size={20}/>
    const icons = {
        "store": <FiDatabase size={20}/>,
        "json": <VscJson size={20}/>,
        "split": <BiGitRepoForked size={20} style={{ transform: "rotateX(180deg)"}}/>,
        "join": <BiGitRepoForked size={20} />,
        "if": <BsDiamond size={20} />,
        'event': <VscSymbolEvent size={20} />,
        "copy": <VscCompareChanges size={20} />,
        "debug": <VscDebugAlt2 size={20} />,
        "property": <RiScissorsCutFill size={20} />,
        "start": <VscDebugStart size={20} />,
        'profile': <BsPerson size={20}/>,
        "stop": <VscDebugStop size={20}/>,
        'plugin': <AiOutlineApi size={20}/>,
        "copy-property": <AiOutlineSisternode size={20} />,
        'location': <FiMapPin size={20} />,
        'time-schedule': <AiOutlineFieldTime size={20} />,
        'clock': <BiTimeFive size={20}/>,
        'time-lapse': <MdTimelapse size={20}/>,
        'x': <TiTimes size={20}/>,
        'message-alert': <BiMessageRoundedError size={20}/>,
        'message-ok': <BiMessageRoundedCheck size={20}/>,
        'message-x': <BiMessageRoundedX size={20} />,
        'alert': <FiAlertTriangle size={20}/>,
        'alert-sound': <AiOutlineAlert size={20}/>,
        'end': <FaRegDotCircle size={20}/>,
        'attach': <IoIosAttach size={20}/>,
        'plus-minus': <RiIncreaseDecreaseLine size={20} />,
        'cloud': <IoCloudOutline size={20} />,
        'weather': <TiWeatherSunny size={20} />,
        'map-properties': <TiFlowSwitch size={20}/>,
        'circut': <VscCircuitBoard size={20}/>,
        'add': <VscAdd size={20}/>,
        'remove': <VscTrash size={20}/>,
        'plus': <VscAdd size={20}/>,
        'minus': <VscRemove size={20}/>,
        'arrow-up': <VscArrowUp size={20}/>,
        'arrow-down': <VscArrowDown size={20}/>,
        'merge': <VscGitMerge size={20}/>,
        'segment': <VscOrganization size={20}/>,
    }

    const renderIcon = () => {
        if (icon in icons) {
            return icons[icon]
        } else {
            return defaultIcon
        }
    }

    return renderIcon()
}