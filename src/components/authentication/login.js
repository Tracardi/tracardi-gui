export function logout() {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-roles')
}
