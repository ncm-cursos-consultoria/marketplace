"use client";

import { me } from "@/service/auth/me";
import { logout as logoutRequest } from "@/service/auth/logout";
import { UserMentorProps } from "@/utils/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface userMentorContextProps {
  userMentor: UserMentorProps | null;
  setUserMentor: Dispatch<SetStateAction<UserMentorProps | null>>;
  logout: (redirectTo?: string) => Promise<void>;
  isLoggingOut: boolean;
}

const userMentorContext = createContext<userMentorContextProps | undefined>(undefined);

export function UserMentorProvider({ children }: { children: React.ReactNode }) {
  const [userMentor, setUserMentor] = useState<UserMentorProps | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery<UserMentorProps | null>({
    queryKey: ["mentor-user"],
    queryFn: me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!data?.id) {
      setUserMentor(null);
      return;
    }
    setUserMentor(data);
  }, [data?.id, isLoading, data]);

  const { mutateAsync: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutRequest,
  });

  const logout = async (redirectTo: string = "/") => {
    try {
      await doLogout();
    } finally {
      setUserMentor(null);
      queryClient.clear();
      router.replace(redirectTo);
    }
  };

  return (
    <userMentorContext.Provider
      value={{ userMentor, setUserMentor, logout, isLoggingOut }}
    >
      {children}
    </userMentorContext.Provider>
  );
}

export function UseUserMentor() {
  const context = useContext(userMentorContext);
  if (!context) throw new Error("userContext error");
  return context;
}
