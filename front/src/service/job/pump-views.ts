import { api } from "../api";

export const pumpViews = async (jobOpeningId: string) => {
  try {
    api.patch(`/job-opening/${jobOpeningId}/view`);
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
