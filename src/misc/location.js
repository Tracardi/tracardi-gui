import axios from "axios";

const getLocation = async () => {
    try {
        const res = await axios.get('https://geolocation-db.com/json/')
        return res.data
    } catch (e) {
        return {}
    }
}

export function displayLocation(geo) {
    if(geo?.country?.code && geo?.country?.name && geo?.city) {
        return `${geo.country.name} (${geo.country.code }), ${geo.city}`
    } else if(geo?.country?.code && geo?.country?.name) {
        return `${geo.country.name} (${geo.country.code})`
    } else if(geo?.country?.name) {
        return `${geo.country.name}`
    } else {
        return "n/a"
    }
}

export default getLocation