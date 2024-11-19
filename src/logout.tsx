import Cookies from "js-cookie";

export const logout = () => {
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
    localStorage.clear(); // Clear storage
    window.location.href = "/"; // Redirect to home or login
};

export const logoutRedirect = () => {
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));
    localStorage.clear(); // Clear storage
    window.location.href = "/"; // Redirect to home or login
};
