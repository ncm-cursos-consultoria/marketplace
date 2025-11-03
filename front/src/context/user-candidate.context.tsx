"use client";

import { me } from "@/service/auth/me";
import { logout as logoutRequest } from "@/service/auth/logout";
import { UserCandidateProps } from "@/utils/interfaces";
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

interface userCandidateProviderProps {
  userCandidate: UserCandidateProps | null;
  setUserCandidate: Dispatch<SetStateAction<UserCandidateProps | null>>;
  logout: (redirectTo?: string) => Promise<void>;
  isLoggingOut: boolean;
  isLoading: boolean;
}

const userCandidateContext = createContext<userCandidateProviderProps | undefined>(undefined);

export function UserCandidateProvider({ children }: { children: React.ReactNode }) {
  const [userCandidate, setUserCandidate] = useState<UserCandidateProps | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UserCandidateProps | null>({
    queryKey: ["authUser"],
    queryFn: me,
    retry: false,
    // staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!data?.id) {
      setUserCandidate(null);
      return;
    }
    setUserCandidate(data);
  }, [data?.id, isLoading, data]);

  const { mutateAsync: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutRequest,
  });

  const logout = async (redirectTo: string = "/") => {
    try {
      await doLogout();
    } finally {
      setUserCandidate(null);
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ['authUser'] })
      router.replace(redirectTo);
    }
  };

  return (
    <userCandidateContext.Provider
      value={{ userCandidate, setUserCandidate, logout, isLoggingOut, isLoading }}
    >
      {children}
    </userCandidateContext.Provider>
  );
}

export function UseUserCandidate() {
  const context = useContext(userCandidateContext);
  if (!context) throw new Error("userContext error");
  return context;
}
