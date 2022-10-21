export function profileName (profile) {
    if(profile?.pii?.name || profile?.pii?.last_name) {
        return `${profile?.pii?.name || ""} ${profile?.pii?.last_name || ""}`
    } else {
        return 'anonymous'
    }
}
