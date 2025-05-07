import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000", // ou a URL da sua API
})

export default api
