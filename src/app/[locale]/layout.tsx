import type { ReactNode } from "react";

export default async function LocaleLayout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {

  return <>{children}</>;
}
