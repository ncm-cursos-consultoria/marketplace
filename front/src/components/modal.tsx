import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

interface modalProps {
  title: string | ReactNode;
  children: ReactNode;
  headerTitle: string;
  className: string;
  subTitles?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export function Modal({ 
  title, 
  children, 
  headerTitle, 
  className, 
  isOpen: propIsOpen, // Renomeia a prop para evitar conflito
  setIsOpen: propSetIsOpen 
}: modalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen ?? internalIsOpen;
  const setIsOpen = propSetIsOpen ?? setInternalIsOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className={className}>
          {headerTitle}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
