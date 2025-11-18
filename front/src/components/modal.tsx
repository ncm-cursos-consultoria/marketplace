import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
// Removi o 'cn' se não estiver usando, ou mantenha se seu projeto usa shadcn padrão

interface modalProps {
  title: string | ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  headerTitle: string;
  className: string;
  contentClassName?: string;
  subTitles?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  disabled?: boolean;
}

export function Modal({
  title,
  children,
  footer,
  headerTitle,
  className,
  contentClassName,
  isOpen: propIsOpen,
  setIsOpen: propSetIsOpen,
  disabled
}: modalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen ?? internalIsOpen;
  const setIsOpen = propSetIsOpen ?? setInternalIsOpen;

  return (
    <Dialog
      open={disabled ? false : isOpen}
      onOpenChange={disabled ? () => { } : setIsOpen}
    >
      <DialogTrigger asChild>
        <button
          className={className}
          disabled={disabled}
        >
          {headerTitle}
        </button>
      </DialogTrigger>

      <DialogContent
        // CORREÇÃO AQUI: Mudei 'max-h-[90vh]' para 'h-[90vh]'
        // Isso força o modal a ser grande, permitindo que o 'flex-1' interno funcione.
        className={`sm:max-w-3xl h-[90vh] flex flex-col gap-0 p-0 ${contentClassName || ''}`}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Corpo do modal que cresce e rola */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          // Rodapé fixo
          <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}