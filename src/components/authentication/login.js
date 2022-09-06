export function isAuth() {
    return getToken() !== null;
}

export function logout() {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-roles')
}

export function setToken(token) {
    localStorage.setItem('auth-token', token);
}

export function setRoles(roles) {
    localStorage.setItem('auth-roles', JSON.stringify(roles))
}

export function getRoles() {
    return JSON.parse(localStorage.getItem('auth-roles'))
}

export function getToken() {
    return localStorage.getItem('auth-token');
}