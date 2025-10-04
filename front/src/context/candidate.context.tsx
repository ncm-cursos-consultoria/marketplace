import { CandidateProps } from "@/utils/interfaces";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface simulateCandidateProps {
  candidate: CandidateProps[] | null;
  setCandidate: Dispatch<SetStateAction<CandidateProps[] | null>>;
}

const SimulateCandidateContext = createContext<
  simulateCandidateProps | undefined
>(undefined);

export function CandidateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [candidate, setCandidate] = useState<CandidateProps[] | null>([]);

  return (
    <SimulateCandidateContext.Provider
      value={{
        candidate,
        setCandidate,
      }}
    >
      {children}
    </SimulateCandidateContext.Provider>
  );
}

export function useSimulateCandidate() {
  const context = useContext(SimulateCandidateContext)
  if(!context) {
    throw new Error(
      'Context simulateCandidate is missing'
    )
  }
  return context
}
