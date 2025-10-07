"use client";

import { me } from "@/service/auth/me";
import { logout as logoutRequest } from "@/service/auth/logout";
import { UserEnterpriseProps } from "@/utils/interfaces";
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

interface userEnterpriseContextProps {
  userEnterprise: UserEnterpriseProps | null;
  setUserEnterprise: Dispatch<SetStateAction<UserEnterpriseProps | null>>;
  logout: (redirectTo?: string) => Promise<void>;
  isLoggingOut: boolean;
}

const userEnterpriseContext = createContext<userEnterpriseContextProps | undefined>(undefined);

export function UserEnterpriseProvider({ children }: { children: React.ReactNode }) {
  const [userEnterprise, setUserEnterprise] = useState<UserEnterpriseProps | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery<UserEnterpriseProps | null>({
    queryKey: ["enterprise-user"],
    queryFn: me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!data?.id) {
      setUserEnterprise(null);
      return;
    }
    setUserEnterprise(data);
  }, [data?.id, isLoading, data]);

  const { mutateAsync: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutRequest,
  });

  const logout = async (redirectTo: string = "/") => {
    try {
      await doLogout();
    } finally {
      setUserEnterprise(null);
      queryClient.clear();
      router.replace(redirectTo);
    }
  };

  return (
    <userEnterpriseContext.Provider
      value={{ userEnterprise, setUserEnterprise, logout, isLoggingOut }}
    >
      {children}
    </userEnterpriseContext.Provider>
  );
}

export function UseUserEnteprise() {
  const context = useContext(userEnterpriseContext);
  if (!context) throw new Error("userContext error");
  return context;
}
