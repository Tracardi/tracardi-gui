export function profileName(profile) {
    if(!profile) {
        return 'profileless'
    } else if(profile?.data?.pii?.firstname || profile?.data?.pii?.lastname) {
        return `${profile?.data?.pii?.firstname || ""} ${profile?.data?.pii?.lastname || ""}`
    } else if (profile?.data?.contact?.email?.main) {
        return profile?.data?.contact?.email?.main
    } else if (profile?.data?.pii?.display_name && profile?.data?.pii?.display_name!=="") {
        return profile?.data?.pii?.display_name
    } else {
        return "Anonymous"
    }
}