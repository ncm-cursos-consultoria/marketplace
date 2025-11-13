export type Notification = {
  id: string;
  title: string;
  body: string;
  // url: string;         // Link para onde o usuário deve ir (ex: /vagas/123)
  isRead: boolean;
  createdAt: string;   // Use 'string' para Instant/Date (ex: "2025-11-13T10:00:00Z")
  readAt?: string | null;
};

export type NotificationPage = {
  content: Notification[];
  totalPages: number;
  totalElements: number;
  number: number; // A página atual
  size: number;
};