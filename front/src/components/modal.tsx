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
  title: string | ReactNode;
  children: ReactNode;
  headerTitle: string;
  className: string;
  subTitles?: string
}

export function Modal({ title, children, headerTitle, className, subTitles }: modalProps) {
  return (
    <Dialog>
      <DialogTrigger className={className}>
        {title}
        {subTitles}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{headerTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
