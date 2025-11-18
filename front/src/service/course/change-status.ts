import { api } from "../api";

export interface changeStatusProps {
  id: string;
  userId: string;
  status: userCourseStatus;
}

export type userCourseStatus = "NOT_STARTED" | "ONGOING" | "FINISHED";

export const changeCourseStatus = async (data: changeStatusProps) => {
  try {
    await api.patch(`/course/${data.id}/${data.userId}/status`,
        null,
        { params: { status: data.status } }
    );
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
