"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseUserCandidate } from "@/context/user-candidate.context";
import { markNotificationAsRead } from "@/service/notification/mark-as-read";
import { Notification } from "@/types/notification";
import { getNotifications } from "@/service/notification/get-notification";
import { UseUserEnteprise } from "@/context/user-enterprise.context";

/**
 * Hook customizado para buscar o snippet de notificações
 */
function useNotificationSnippet(userId: string) {
    const { data, isLoading } = useQuery({
        queryKey: ["notifications", "snippet", userId],
        queryFn: () =>
            getNotifications({
                userIds: [userId],
                isRead: false,
                // removeReadAfter1Day: true,
                page: 0,
                size: 5,
            }),
        enabled: !!userId,
        staleTime: 1000 * 60,
    });
    console.log(`Notifications found for id ${userId}: `, data);
    

    const unreadCount = data?.totalElements ?? 0;
    const snippets = data?.content ?? [];

    return { unreadCount, snippets, isLoading };
}

/**
 * O componente principal do "Sininho"
 */
export function NotificationBell() {
    const { userEnterprise } = UseUserEnteprise();
    const userId = userEnterprise?.id;
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();

    const { unreadCount, snippets, isLoading } = useNotificationSnippet(userId!);

    const { mutate: markAsRead } = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const handleNotificationClick = (notification: Notification) => {
        // Apenas marca como lida. O <Link> cuidará da navegação.
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
    };

    if (!userId) {
        return null;
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white/70 hover:text-white hover:bg-white/10"
                >
                    <Bell className="h-5 w-5" />
                    {isLoading && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <Loader2 className="h-3 w-3 animate-spin" />
                        </span>
                    )}
                    {/* 6. O Contador Vermelho */}
                    {!isLoading && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            {/* 7. O Conteúdo do Popover */}
            <PopoverContent className="w-80 p-0">
                <div className="p-4 border-b">
                    <h4 className="font-semibold">Notificações</h4>
                </div>

                <ScrollArea className="h-auto max-h-96">
                    {snippets.length === 0 ? (
                        <p className="p-4 text-center text-sm text-neutral-500">
                            Nenhuma notificação nova.
                        </p>
                    ) : (
                        <div className="divide-y divide-neutral-100">
                            {snippets.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={`/br/enterprise/notificacoes/${userId}`}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="block p-3 hover:bg-neutral-50"
                                >
                                    <p className="text-sm font-medium text-neutral-800">
                                        {notification.title}
                                    </p>
                                    <time className="text-xs text-neutral-500">
                                        {new Date(notification.createdAt).toLocaleDateString("pt-BR")}
                                    </time>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-2 border-t bg-neutral-50">
                    <Button variant="link" size="sm" asChild className="w-full">
                        <Link href={`/br/enterprise/notificacoes/${userId}`}>
                            Ver todas as notificações
                        </Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}