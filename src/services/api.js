import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3333",
});

export default api;

// rota android 10.0.2.2
// rota ios localhost