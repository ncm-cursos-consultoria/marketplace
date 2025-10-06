"use client";

import { me } from "@/service/auth/me";
import { UserCandidateProps } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
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
}

const userCandidateContext = createContext<userCandidateProviderProps | undefined>(undefined);

export function UserCandidateProvider({ children }: { children: React.ReactNode }) {
  const [userCandidate, setUserCandidate] = useState<UserCandidateProps | null>(null);
  const router = useRouter()

  const { data, isLoading } = useQuery<UserCandidateProps | null>({
    queryKey: ["authUser"],
    queryFn: me,

    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!data?.id) {
      setUserCandidate(null);
      return;
    }
    setUserCandidate(data);
  }, [data?.id, isLoading, data]);

  console.log(userCandidate);
  

  return (
    <userCandidateContext.Provider value={{ userCandidate, setUserCandidate }}>
      {children}
    </userCandidateContext.Provider>
  );
}

export function UseUserCandidate() {
  const context = useContext(userCandidateContext);
  if (!context) throw new Error("userContext error");
  return context;
}
