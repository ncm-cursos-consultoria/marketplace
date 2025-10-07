"use client";

import { me } from "@/service/auth/me";
import { logout as logoutRequest } from "@/service/auth/logout";
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
import { UserPartnerProps } from "@/utils/interfaces";

interface userPartnerContextProps {
  userPartner: UserPartnerProps | null;
  setUserPartner: Dispatch<SetStateAction<UserPartnerProps | null>>;
  logout: (redirectTo?: string) => Promise<void>;
  isLoggingOut: boolean;
}

const userPartnerContext = createContext<userPartnerContextProps | undefined>(undefined);

export function UserPartnerProvider({ children }: { children: React.ReactNode }) {
  const [userPartner, setUserPartner] = useState<UserPartnerProps | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery<UserPartnerProps | null>({
    queryKey: ["authUser"],
    queryFn: me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!data?.id) {
      setUserPartner(null);
      return;
    }
    setUserPartner(data);
  }, [data?.id, isLoading, data]);

  const { mutateAsync: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutRequest,
  });

  const logout = async (redirectTo: string = "/") => {
    try {
      await doLogout();
    } finally {
      setUserPartner(null);
      queryClient.clear();
      router.replace(redirectTo);
    }
  };

  return (
    <userPartnerContext.Provider
      value={{ userPartner, setUserPartner, logout, isLoggingOut }}
    >
      {children}
    </userPartnerContext.Provider>
  );
}

export function UseUserPartner() {
  const context = useContext(userPartnerContext);
  if (!context) throw new Error("userContext error");
  return context;
}
