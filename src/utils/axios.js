import axios from 'axios';

// Build a safe base URL that always targets the API prefix `/api/v1`.
// This prevents 404s when deployments set `VITE_API_BASE_URL` without the
// expected `/api/v1` suffix (e.g. https://rentyfy-back-end-11aw.onrender.com).
const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const trimmed = rawBase.replace(/\/+$/g, ''); // remove trailing slashes
const baseURL = trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;

const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;