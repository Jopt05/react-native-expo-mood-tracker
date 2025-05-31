import axios from "axios";

const moodTrackedApi = axios.create({
    baseURL: 'https://mood-tracker-app-backend-ntsz.onrender.com/api',
});

export default moodTrackedApi;