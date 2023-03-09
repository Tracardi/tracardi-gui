import Cookies from 'universal-cookie';

export function isAuth() {
    return getToken() !== null;
}

export function logout() {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-roles')
}

export function setToken(token) {
    const cookies = new Cookies();
    cookies.set('tracardi-auth-token', token, { path: '/' });
}

export function setRoles(roles) {
    localStorage.setItem('auth-roles', JSON.stringify(roles))
}

export function getRoles() {
    return JSON.parse(localStorage.getItem('auth-roles'))
}

export function getToken() {
    const cookies = new Cookies();
    return cookies.get('tracardi-auth-token');
}