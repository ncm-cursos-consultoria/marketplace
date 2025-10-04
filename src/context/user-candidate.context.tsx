import { UserCandidateProps } from "@/utils/interfaces";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface userCandidateProviderProps {
  userCandidate: UserCandidateProps | null;
  setUserCandidate: Dispatch<SetStateAction<UserCandidateProps | null>>;
}

const userCandidateContext = createContext<
  userCandidateProviderProps | undefined
>(undefined);

export function UserCandidateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userCandidate, setUserCandidate] = useState<UserCandidateProps | null>(
    null
  );

  return (
    <userCandidateContext.Provider value={{ userCandidate, setUserCandidate }}>
      {children}
    </userCandidateContext.Provider>
  );
}

export function UseUserCandidate() {
  const context = useContext(userCandidateContext);
  if (!context) {
    throw new Error("userContext error");
  }
  return context;
}