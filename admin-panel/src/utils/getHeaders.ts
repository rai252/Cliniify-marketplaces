export const getHeaders = () => {
    const headers = new Headers();
    const token = localStorage.getItem('adminPanel_accessToken');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
};