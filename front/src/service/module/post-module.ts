import { api } from "../api";

export interface postModuleProps {
  title: string;
  description: string;
  freePlan?: boolean;
  hasMentorship?: boolean;
  mentorshipValuePerHour?: number;
  mentorId?: string;
}

export const postModule = async (data: postModuleProps) => {
  try {
    const res = await api.post(`/module`, data);
    return res.data
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
