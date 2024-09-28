import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
});

export async function isOrgCheck(setterFunc){
    const token = localStorage.getItem("loginToken");
    try {
        console.log(token);
        const authStr = "Bearer ".concat(token);
        const response = await api.get('/orgcheck', {headers: {Authorization: authStr}});
        setterFunc(response.data.isOrg);
    }
    catch (err) {
        console.log("error trying to get response for org check");
    }
}
