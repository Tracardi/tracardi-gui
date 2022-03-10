import {BiGitRepoForked} from "react-icons/bi";
import React from "react";
import {FiDatabase, FiMapPin, FiAlertTriangle} from "react-icons/fi";
import {BsDiamond, BsPerson, BsCalculator, BsBoxArrowInUpRight, BsShuffle, BsFillGeoFill, BsHddNetwork} from "react-icons/bs";
import {AiOutlineSisternode, AiOutlineFieldTime, AiOutlineAlert, AiOutlineWhatsApp} from "react-icons/ai";
import {MdTimelapse} from "react-icons/md";
import {TiTimes, TiFlowSwitch} from "react-icons/ti";
import {
    BiMessageRoundedError,
    BiTimeFive,
    BiMessageRoundedCheck,
    BiMessageRoundedX,
    BiGroup,
    BiBarChartAlt,
    BiCloudRain,
    BiTime,
    BiParagraph,
    BiArrowToRight
} from "react-icons/bi";
import {RiIncreaseDecreaseLine, RiScissorsCutFill} from "react-icons/ri";
import {IoCloudOutline, IoPush, IoLanguageOutline, IoTextOutline, IoCalendarOutline, IoGitNetworkSharp} from "react-icons/io5";
import {
    VscSymbolEvent,
    VscRegex,
    VscPlug,
    VscJson,
    VscRadioTower,
    VscReplace,
    VscError,
    VscTwitter,
    VscGlobe,
    VscQuestion,
    VscColorMode,
    VscCircuitBoard,
    VscRemove,
    VscAdd,
    VscArrowDown,
    VscDebugStop,
    VscArrowUp,
    VscDebugStart,
    VscDebugAlt,
    VscTrash,
    VscCopy,
    VscGitMerge,
    VscOrganization,
    VscMail,
    VscBracketError,
    VscRunErrors,
    VscExclude,
    VscSymbolArray
} from "react-icons/vsc";
import {MdLibraryAdd, MdTimer} from "react-icons/md";
import {GoBrowser} from "react-icons/go";
import { ReactComponent as MauticLogo } from "../../svg/mautic.svg";
import { ReactComponent as Amplitude } from "../../svg/amplitude-icon.svg";
import { ReactComponent as Mixpanel } from "../../svg/mixpanel.svg";
import {
    SiRabbitmq,
    SiMongodb,
    SiRedis,
    SiPostgresql,
    SiTwilio,
    SiCurl,
    SiGoogletranslate,
    SiElasticsearch,
    SiInfluxdb,
    SiZapier,
    SiAirtable
} from "react-icons/si";
import {GrMysql} from "react-icons/gr";
import {
    AiOutlineSlack,
    AiOutlinePieChart,
    AiOutlineSplitCells,
    AiOutlineCheckCircle,
    AiFillGoogleCircle
} from "react-icons/ai";
import {FaFacebookSquare, FaDiscord} from "react-icons/fa";
import {RiRestTimeLine} from "react-icons/ri";
import {IoIosTimer, IoIosContact, IoIosAttach} from "react-icons/io";
import {CgCalendarToday} from "react-icons/cg";
import {ImInsertTemplate} from "react-icons/im";
import {FaAws, FaTrello, FaRegDotCircle, FaMailchimp, FaHtml5, FaRobot, FaUncharted} from "react-icons/fa";
import {DiReact} from "react-icons/di";
import {GiPathDistance} from "react-icons/gi";

export const icons = {
    "store": (size) => <FiDatabase size={size}/>,
    "json": (size) => <VscJson size={size}/>,
    "split": (size) => <BiGitRepoForked size={size} style={{transform: "rotateX(180deg)"}}/>,
    "join": (size) => <BiGitRepoForked size={size}/>,
    "if": (size) => <BsDiamond size={size}/>,
    'event': (size) => <VscSymbolEvent size={size}/>,
    "copy": (size) => <VscCopy size={size}/>,
    "debug": (size) => <VscDebugAlt size={size}/>,
    "property": (size) => <RiScissorsCutFill size={size}/>,
    "start": (size) => <VscDebugStart size={size}/>,
    'profile': (size) => <BsPerson size={size}/>,
    "stop": (size) => <VscDebugStop size={size}/>,
    'plugin': (size) => <VscPlug size={size}/>,
    "copy-property": (size) => <AiOutlineSisternode size={size}/>,
    'location': (size) => <FiMapPin size={size}/>,
    'timer': (size) => <MdTimer size={size}/>,
    'clock': (size) => <BiTimeFive size={size}/>,
    'sleep': (size) => <RiRestTimeLine size={size}/>,
    'time-lapse': (size) => <MdTimelapse size={size}/>,
    'time': (size) => <BiTime size={size}/>,
    'wait': (size) => <AiOutlineFieldTime size={size}/>,
    'x': (size) => <TiTimes size={size}/>,
    'message-alert': (size) => <BiMessageRoundedError size={size}/>,
    'message-ok': (size) => <BiMessageRoundedCheck size={size}/>,
    'message-x': (size) => <BiMessageRoundedX size={size}/>,
    'alert': (size) => <FiAlertTriangle size={size}/>,
    'alert-sound': (size) => <AiOutlineAlert size={size}/>,
    'end': (size) => <FaRegDotCircle size={size}/>,
    'attach': (size) => <IoIosAttach size={size}/>,
    'plus-minus': (size) => <RiIncreaseDecreaseLine size={size}/>,
    'cloud': (size) => <IoCloudOutline size={size}/>,
    'weather': (size) => <BiCloudRain size={size}/>,
    'map-properties': (size) => <TiFlowSwitch size={size}/>,
    'circut': (size) => <VscCircuitBoard size={size}/>,
    'add': (size) => <VscAdd size={size}/>,
    'remove': (size) => <VscTrash size={size}/>,
    'plus': (size) => <VscAdd size={size}/>,
    'minus': (size) => <VscRemove size={size}/>,
    'arrow-up': (size) => <VscArrowUp size={size}/>,
    'arrow-down': (size) => <VscArrowDown size={size}/>,
    'merge': (size) => <VscGitMerge size={size}/>,
    'segment': (size) => <VscOrganization size={size}/>,
    'append': (size) => <MdLibraryAdd size={size}/>,
    'browser': (size) => <GoBrowser size={size}/>,
    'question': (size) => <VscQuestion size={size}/>,
    'dark-light': (size) => <VscColorMode size={size}/>,
    'zapier': (size) => <SiZapier size={size}/>,
    'whatsapp': (size) => <AiOutlineWhatsApp size={size}/>,
    "rabbitmq": (size) => <SiRabbitmq size={size}/>,
    'mongo': (size) => <SiMongodb size={size}/>,
    'email': (size) => <VscMail size={size}/>,
    'mysql': (size) => <GrMysql size={size}/>,
    'discord': (size) => <FaDiscord size={size}/>,
    'slack': (size) => <AiOutlineSlack size={size}/>,
    'facebook': (size) => <FaFacebookSquare size={size}/>,
    'twitter': (size) => <VscTwitter size={size}/>,
    'bar-chart': (size) => <BiBarChartAlt size={size}/>,
    'redis': (size) => <SiRedis size={size}/>,
    'globe': (size) => <VscGlobe size={size}/>,
    'profiler': (size) => <IoIosTimer size={size}/>,
    'error': (size) => <VscError size={size}/>,
    'postgres': (size) => <SiPostgresql size={size}/>,
    'today': (size) => <CgCalendarToday size={size}/>,
    'fullcontact': (size) => <IoIosContact size={size}/>,
    'paragraph': (size) => <BiParagraph size={size}/>,
    "pushover": (size) => <IoPush size={size}/>,
    'splitter': (size) => <AiOutlineSplitCells size={size}/>,
    "language": (size) => <IoLanguageOutline size={size}/>,
    "regex": (size) => <VscRegex size={size}/>,
    "ok": (size) => <AiOutlineCheckCircle size={size}/>,
    "uppercase": (size) => <IoTextOutline size={size}/>,
    "url": (size) => <SiCurl size={size}/>,
    "group-person": (size) => <BiGroup size={size}/>,
    'replace': (size) => <VscReplace size={size}/>,
    'template': (size) => <ImInsertTemplate size={size}/>,
    'aws': (size) => <FaAws size={size}/>,
    'pie-chart': (size) => <AiOutlinePieChart size={size}/>,
    'tower': (size) => <VscRadioTower size={size}/>,
    'calculator': (size) => <BsCalculator size={size}/>,
    'twilio': (size) => <SiTwilio size={size}/>,
    'mailchimp': (size) => <FaMailchimp size={size}/>,
    'inbound': (size) => <BsBoxArrowInUpRight size={size}/>,
    'elasticsearch': (size) => <SiElasticsearch size={size}/>,
    'react': (size) => <DiReact size={size}/>,
    'trello': (size) => <FaTrello size={size}/>,
    'calendar': (size) => <IoCalendarOutline size={size}/>,
    'translate': (size) => <SiGoogletranslate size={size}/>,
    'google': (size) => <AiFillGoogleCircle size={size}/>,
    'shuffle': (size) => <BsShuffle size={size}/>,
    'influxdb': (size) => <SiInfluxdb size={size}/>,
    'json-error': (size) => <VscBracketError size={size}/>,
    'run-error': (size) => <VscRunErrors size={size}/>,
    'config-error': (size) => <VscExclude size={size}/>,
    'geo-fence': (size) => <BsFillGeoFill size={size}/>,
    'html5': (size) => <FaHtml5 size={size}/>,
    'threshold': (size) => <BiArrowToRight size={size}/>,
    'path': (size) => <GiPathDistance size={size}/>,
    'airtable': (size) => <SiAirtable size={size}/>,
    'mautic': (size) => <MauticLogo style={{width: size, height: size}}/>,
    'ai': (size) => <FaRobot size={size} />,
    'amplitude': (size) => <Amplitude style={{width: size, height: size}}/>,
    'mixpanel': (size) => <Mixpanel style={{width: size, height: size}}/>,
    'array': (size) => <VscSymbolArray size={size} />,
    'resource': (size) => <BsHddNetwork size={size}/>,
    'flow': (size) => <IoGitNetworkSharp size={size}/>,
    'route': (size) => <FaUncharted size={size}/>
}


export default function FlowNodeIcons({icon, size = 20, defaultIcon="plugin"}) {

    const renderIcon = () => {
        if (icon in icons) {
            return icons[icon](size)
        } else {
            return icons[defaultIcon](size)
        }
    }

    return renderIcon()
}

