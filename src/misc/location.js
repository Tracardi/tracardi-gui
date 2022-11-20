import axios from "axios";

const getLocation = async () => {
    try {
        const res = await axios.get('https://geolocation-db.com/json/')
        return res.data
    } catch (e) {
        return {}
    }
}

export default getLocation