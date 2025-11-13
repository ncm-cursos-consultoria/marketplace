"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns"; // Para formatar "há 2 dias"
import { ptBR } from "date-fns/locale";
import { Loader2, ArrowLeft, ArrowRight, Inbox, Check } from "lucide-react";

// --- Imports de Serviços e Tipos ---
import { markNotificationAsRead } from "@/service/notification/mark-as-read";
import { Notification, NotificationPage } from "@/types/notification";

// --- Imports de UI ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNotifications } from "@/service/notification/get-notification";

// -----------------------------------------------------------------
// --- Componente de Item da Lista (Sub-componente) ---
// -----------------------------------------------------------------
interface NotificationItemProps {
    notification: Notification;
    isExpanded: boolean; // Novo: Sabe se está expandido
    onToggle: (id: string) => void; // Novo: Função para alternar
}

function NotificationItem({ notification, isExpanded, onToggle }: NotificationItemProps) {
    // Não precisamos mais do router ou Link aqui

    return (
        <div
            onClick={() => onToggle(notification.id)}
            className={`p-4 border-b transition-colors cursor-pointer
                ${notification.isRead // <--- AQUI ESTÁ A LÓGICA
                    ? 'bg-white hover:bg-neutral-50'   // 1. SE LIDA: Fica branco/cinza
                    : 'bg-blue-50 hover:bg-blue-100' // 2. SE NÃO LIDA: Fica azul
                }`}
        >
            <div className="flex items-center gap-4">
                {/* O "ponto" de não lido */}
                <div className="flex-shrink-0 w-4 h-4">
                    {!notification.isRead && ( // <--- AQUI (O ponto azul só aparece se NÃO LIDA)
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    )}
                </div>

                {/* O Título e Data */}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.isRead ? 'text-neutral-600' : 'font-semibold text-neutral-800'}`}>
                        {notification.title} {/* 3. Mostra o 'title' aqui */}
                    </p>
                    <time className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                        })}
                    </time>
                </div>
            </div>

            {/* 4. SEÇÃO EXPANSÍVEL (Mostra o 'body') */}
            {isExpanded && (
                <div className="mt-3 pt-3 pl-8 border-t border-neutral-200">
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                        {notification.body}
                    </p>
                </div>
            )}
        </div>
    );
}

// -----------------------------------------------------------------
// --- Componente Principal da Página (ATUALIZADO) ---
// -----------------------------------------------------------------
export default function NotificationsPage() {
    const params = useParams();
    const userId = params.id as string;
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);

    // 5. Novo estado para controlar qual item está expandido
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // --- 1. Busca de Dados (Paginação) ---
    const { data: pageData, isLoading, isError } = useQuery<NotificationPage>({
        queryKey: ["notifications", "all", userId, page],
        queryFn: () =>
            getNotifications({
                userIds: [userId],
                removeReadAfter1Day: false,
                page: page,
                size: 10,
            }),
        enabled: !!userId,
        staleTime: 1000 * 30,
    });

    // --- 2. Mutação (Marcar como Lida) ---
    const { mutate: markAsRead } = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: (updatedNotification) => {
            // Atualiza o cache de ambas as queries (snippet e all)
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: () => {
            toast.error("Erro ao marcar notificação como lida.");
        }
    });

    // 6. Nova função de Toggle (Expandir/Fechar)
    const handleToggle = (notification: Notification) => {
        // Se não estiver lida, marca como lida
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Alterna o estado de expansão
        setExpandedId(currentId => (currentId === notification.id ? null : notification.id));
    };

    // --- 3. Renderização ---
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return <p className="p-8 text-center text-red-600">Erro ao carregar notificações.</p>;
    }

    const notifications = pageData?.content ?? [];
    const totalPages = pageData?.totalPages ?? 0;
    const currentPage = pageData?.number ?? 0;

    return (
        <main className="flex-1 bg-neutral-100 p-4 md:p-8">
            <Card className="max-w-4xl mx-auto shadow-sm overflow-hidden">
                <CardHeader>
                    <CardTitle>Minhas Notificações</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {notifications.length === 0 ? (
                        // --- Estado Vazio ---
                        <div className="p-10 text-center text-neutral-500">
                            <Inbox className="h-12 w-12 mx-auto mb-2" />
                            <p className="font-medium">Nenhuma notificação encontrada.</p>
                            <p className="text-sm">Você está em dia!</p>
                        </div>
                    ) : (
                        // --- Lista de Notificações ---
                        <div className="border-t border-neutral-200">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    // 7. Passa os novos props
                                    isExpanded={notification.id === expandedId}
                                    onToggle={() => handleToggle(notification)}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>

                {/* --- 4. Controles de Paginação --- */}
                {totalPages > 1 && (
                    <div className="p-4 border-t bg-neutral-50 flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p - 1)}
                            disabled={currentPage === 0}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Anterior
                        </Button>

                        <span className="text-sm text-neutral-600">
                            Página {currentPage + 1} de {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={currentPage + 1 >= totalPages}
                        >
                            Próxima
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}
            </Card>
        </main>
    );
}