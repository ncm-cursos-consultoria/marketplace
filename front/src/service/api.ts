import { ip } from "@/utils/ip";
import axios from "axios";

export const api = axios.create({
    baseURL: `${ip}`,
    withCredentials: true,
    paramsSerializer: {
        serialize: (params) => {
            const searchParams = new URLSearchParams();
            for (const key in params) {
                const value = params[key];
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        searchParams.append(key, item);
                    });
                } else if (value !== null && value !== undefined) {
                    searchParams.append(key, value);
                }
            }
            return searchParams.toString();
        }
    }
})