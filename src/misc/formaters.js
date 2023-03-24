export function profileName(profile) {
    if(!profile) {
        return 'profileless'
    } else if(profile?.pii?.name || profile?.pii?.surname) {
        return `${profile?.pii?.name || ""} ${profile?.pii?.surname || ""}`
    } else if (profile?.pii?.email) {
        return profile?.pii?.email
    } else {
        return "Anonymous"
    }
}