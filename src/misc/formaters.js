export function profileName(profile) {
    if(!profile) {
        return 'profileless'
    }else if(profile?.pii?.name || profile?.pii?.last_name) {
        return `${profile?.pii?.name || ""} ${profile?.pii?.last_name || ""} ${profile?.pii?.email || ""}`
    } else {
        return `anonymous ${profile?.pii?.email || ""}`
    }
}