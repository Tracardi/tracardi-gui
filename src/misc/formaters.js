export function profileName(profile) {
    if(!profile) {
        return 'profileless'
    } else if(profile?.data?.pii?.firstname || profile?.data?.pii?.lastname) {
        return `${profile?.data?.pii?.firstname || ""} ${profile?.data?.pii?.lastname || ""}`
    } else if (profile?.data?.contact?.email) {
        return profile?.data?.contact?.email
    } else if (profile?.data?.pii?.name && profile?.data?.pii?.name!=="") {
        return profile?.data?.pii?.name
    } else {
        return "Anonymous"
    }
}