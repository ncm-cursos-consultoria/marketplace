// service/user/patch-profile-picture.ts
import { api } from "../api";

export async function patchProfilePicture(file: File, userId: string) {
  
  const fd = new FormData();
  fd.append("file", file);
  fd.append("fileType", "PROFILE_PICTURE");

  
  try {
    const { data } = await api.patch(`/user/${userId}/upload`, fd);
    return data;
  } catch (error) {
    console.error("patchProfilePicture - erro:", error);
    throw error;
  }
}