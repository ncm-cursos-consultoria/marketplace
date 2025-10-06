"use client";

import { me } from "@/service/auth/me";
import { UserEnterpriseProps } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
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
}

const userEnterpriseContext = createContext<
  userEnterpriseContextProps | undefined
>(undefined);

export function UserEnterpriseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userEnterprise, setUserEnterprise] =
    useState<UserEnterpriseProps | null>(null);

  const { data, isLoading } = useQuery<UserEnterpriseProps | null>({
    queryKey: ["authUser"],
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

  return (
    <userEnterpriseContext.Provider value={{ userEnterprise, setUserEnterprise }}>
      {children}
    </userEnterpriseContext.Provider>
  );
}

export function UseUserEnteprise() {
  const context = useContext(userEnterpriseContext);
  if (!context) throw new Error("userContext error");
  return context;
}
