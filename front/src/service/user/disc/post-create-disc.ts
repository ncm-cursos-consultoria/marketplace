import { api } from "../../api";

export interface postDiscProps {
  questions: postDiscQuestionProps[];
}

interface postDiscQuestionProps {
    id: string;
    score: number;
}

export const postDisc = async (userId: string, data: postDiscProps) => {
  const res = await api.post(`/user/candidate/${userId}/disc`, data);
  return res.data;
};
