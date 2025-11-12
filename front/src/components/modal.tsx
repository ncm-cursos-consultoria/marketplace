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
  disabled?: boolean; // 1. A prop 'disabled' já está aqui
}

export function Modal({
  title,
  children,
  headerTitle,
  className,
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
  disabled // 2. Receba a prop 'disabled'
}: modalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen ?? internalIsOpen;
  const setIsOpen = propSetIsOpen ?? setInternalIsOpen;

  return (
    <Dialog
      open={disabled ? false : isOpen} // 3. Se estiver desabilitado, force o 'open' para false
      onOpenChange={disabled ? () => { } : setIsOpen} // 4. Se desabilitado, não permita abrir
    >
      <DialogTrigger asChild>
        <button
          className={className}
          disabled={disabled} // 5. APLIQUE A PROP 'disabled' AQUI
        >
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