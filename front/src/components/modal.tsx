import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface modalProps {
  title: string;
  children: ReactNode;
  headerTitle: string;
  className: string
}

export function Modal({ title, children, headerTitle, className }: modalProps) {
  return (
    <Dialog>
      <DialogTrigger className={className}>{title}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{headerTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
