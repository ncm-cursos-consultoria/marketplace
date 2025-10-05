import { login } from "@/service/auth/login";
import { me } from "@/service/auth/me";
import { UserCandidateProps } from "@/utils/interfaces";
import { useQuery } from "@tanstack/react-query";
import {
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

  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      setUserCandidate(data);
    } else {
      setUserCandidate(null);
    }
  }, [data]);

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
