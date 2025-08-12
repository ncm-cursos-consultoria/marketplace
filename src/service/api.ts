import { ip } from "@/utils/ip";
import axios from "axios";

export const api = axios.create({
    baseURL: `${ip}`,
    withCredentials: true
})