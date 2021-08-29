import {BiGitRepoForked} from "@react-icons/all-files/bi/BiGitRepoForked";
import React from "react";
import {VscJson} from "@react-icons/all-files/vsc/VscJson";
import {FiDatabase} from "@react-icons/all-files/fi/FiDatabase";
import {VscSymbolEvent} from "@react-icons/all-files/vsc/VscSymbolEvent";
import {BsDiamond} from "@react-icons/all-files/bs/BsDiamond";
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
import {MdLibraryAdd} from "@react-icons/all-files/md/MdLibraryAdd";
import {GoBrowser} from "@react-icons/all-files/go/GoBrowser";
import {VscQuestion} from "@react-icons/all-files/vsc/VscQuestion";
import {VscColorMode} from "@react-icons/all-files/vsc/VscColorMode";
import {SiZapier} from "@react-icons/all-files/si/SiZapier";
import {AiOutlineWhatsApp} from "@react-icons/all-files/ai/AiOutlineWhatsApp";
import {SiRabbitmq} from "@react-icons/all-files/si/SiRabbitmq";
import {VscPlug} from "@react-icons/all-files/vsc/VscPlug";
import {SiMongodb} from "@react-icons/all-files/si/SiMongodb";
import {VscMail} from "@react-icons/all-files/vsc/VscMail";
import {GrMysql} from "@react-icons/all-files/gr/GrMysql";
import {AiOutlineSlack} from "@react-icons/all-files/ai/AiOutlineSlack";
import {FaDiscord} from "@react-icons/all-files/fa/FaDiscord";
import {VscTwitter} from "@react-icons/all-files/vsc/VscTwitter";
import {FaFacebookSquare} from "@react-icons/all-files/fa/FaFacebookSquare";
import {BiBarChartAlt} from "@react-icons/all-files/bi/BiBarChartAlt";
import {BiCloudRain} from "@react-icons/all-files/bi/BiCloudRain";
import {BiTime} from "@react-icons/all-files/bi/BiTime";
import {MdTimer} from "@react-icons/all-files/md/MdTimer";
import {RiRestTimeLine} from "@react-icons/all-files/ri/RiRestTimeLine";
import {SiRedis} from "@react-icons/all-files/si/SiRedis";
import {VscGlobe} from "@react-icons/all-files/vsc/VscGlobe";
import {IoIosTimer} from "@react-icons/all-files/io/IoIosTimer";
import {VscError} from "@react-icons/all-files/vsc/VscError";

export default function FlowNodeIcons({icon}) {

    const defaultIcon = <VscPlug size={20}/>
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
        'plugin': <VscPlug size={20}/>,
        "copy-property": <AiOutlineSisternode size={20} />,
        'location': <FiMapPin size={20} />,
        'timer': <MdTimer size={20} />,
        'clock': <BiTimeFive size={20}/>,
        'sleep': <RiRestTimeLine size={20}/>,
        'time-lapse': <MdTimelapse size={20}/>,
        'time': <BiTime size={20}/>,
        'wait': <AiOutlineFieldTime size={20}/>,
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
        'weather': <BiCloudRain size={20} />,
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
        'append': <MdLibraryAdd size={20}/>,
        'browser': <GoBrowser size={20}/>,
        'question': <VscQuestion size={20}/>,
        'dark-light': <VscColorMode size={20}/>,
        'zapier': <SiZapier size={20}/>,
        'whatsapp': <AiOutlineWhatsApp size={20}/>,
        "rabbitmq": <SiRabbitmq size={20}/>,
        'mongo': <SiMongodb size={20}/>,
        'email': <VscMail size={20}/>,
        'mysql': <GrMysql size={20}/>,
        'discord': <FaDiscord size={20}/>,
        'slack': <AiOutlineSlack size={20}/>,
        'facebook': <FaFacebookSquare size={20}/>,
        'twitter': <VscTwitter size={20}/>,
        'bar-chart': <BiBarChartAlt size={20}/>,
        'redis': <SiRedis size={20}/>,
        'globe': <VscGlobe size={20}/>,
        'profiler': <IoIosTimer size={20}/>,
        'error': <VscError size={20}/>
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