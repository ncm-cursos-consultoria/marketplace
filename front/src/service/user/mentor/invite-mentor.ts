import { api } from "../../api";

export interface InviteUserMentor {
  firstName: string,
  email: string,
}

export async function inviteUserMentor(id: string, inviteData: InviteUserMentor) {

  try {
    await api.post(`/user/mentor/invite`, inviteData);
  } catch (error) {
    console.error("Error inviting mentor:", error);
    throw error;
  }
}