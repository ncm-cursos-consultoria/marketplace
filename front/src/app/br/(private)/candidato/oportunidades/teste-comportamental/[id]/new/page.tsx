'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UseUserCandidate } from '@/context/user-candidate.context'; // 1. Importe o hook do contexto
import { getAllDiscQuestions } from "@/service/user/disc/get-all-disc-questions"; // Ajuste o caminho se necessário
import { postDisc, postDiscProps } from "@/service/user/disc/post-create-disc";
import { toast } from "sonner";

interface Question {
    id: string;
    name: string;
}

interface Answers {
    [questionId: string]: number;
}

export default function NewDiscTestPage() {
    const { userCandidate } = UseUserCandidate(); // 2. Use o hook para pegar os dados do usuário
    const router = useRouter();
    const queryClient = useQueryClient();

    // "Memória" do componente (Estado)
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<Answers>({});

    // O "Gatilho" que busca os dados da API quando a página carrega
    useEffect(() => {
        async function fetchQuestions() {
            try {
                const questionList = await getAllDiscQuestions();

                setQuestions(questionList);
            } catch (error) {
                console.error("Falha ao carregar perguntas:", error);
                toast.error("Falha ao carregar as perguntas do teste.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuestions();
    }, []);

    // Função chamada toda vez que o usuário muda o score de uma pergunta
    const handleScoreChange = (questionId: string, score: number) => {
        // Validação para garantir que o score está entre 1 e 4
        if (score >= 1 && score <= 4) {
            setAnswers(prevAnswers => ({
                ...prevAnswers, // Copia todas as respostas antigas
                [questionId]: score, // E atualiza/adiciona a nova resposta
            }));
        }
    };

    const { mutate: submitTest, isPending } = useMutation({
        mutationFn: ({ userId, payload }: { userId: string, payload: postDiscProps }) => {
            // A função que realmente chama a API
            return postDisc(userId, payload);
        },
        onSuccess: (dataDoNovoDisc) => {
            toast.success("Teste enviado com sucesso!");            
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            if (userCandidate?.id) {
                router.push(`/br/candidato/oportunidades/teste-comportamental/${userCandidate.id}`);
            }
        },
        onError: (error) => {
            console.error("Falha ao enviar o teste:", error);
            toast.error("Ocorreu um erro ao enviar seu teste. Tente novamente.");
        }
    });

    // Função chamada ao clicar no botão "Finalizar Teste"
    const handleSubmit = () => {
        const userId = userCandidate?.id;

        if (!userId) {
            toast.error("Usuário não autenticado. Faça login novamente.");
            router.push('/auth/sign-in');
            return;
        }
        
        const formattedAnswers = Object.entries(answers).map(([id, score]) => ({
            id,
            score,
        }));

        if (formattedAnswers.length !== questions.length) {
            toast.warning("Por favor, responda todas as perguntas.");
            return;
        }

        // Crie o payload que bate com a interface 'postDiscProps'
        const payload: postDiscProps = {
            questions: formattedAnswers
        };

        // Chame a mutação
        submitTest({ userId, payload });
    };

    if (isLoading) {
        return <main className="p-10">Carregando perguntas...</main>;
    }

    const itemsPerColumn = Math.ceil(questions.length / 4);
    const columns = Array.from({ length: 4 }, (_, colIndex) =>
        questions.slice(colIndex * itemsPerColumn, (colIndex + 1) * itemsPerColumn)
    );

    return (
        <main className="p-6 lg:p-10 space-y-8">
            <header className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                    Teste Comportamental DISC
                </h1>
                <p className="text-gray-600 text-base"> {/* Adicionado text-base para aumentar a fonte */}
                    Para cada palavra, atribua uma nota de 1 a 4, sendo 1 "pouco a ver comigo" e 4 "tudo a ver comigo".
                </p>
            </header>

            {/* --- NOVO LAYOUT EM GRID --- */}
            {/* 'grid-cols-4' cria 4 colunas. 'gap-8' adiciona espaço entre elas. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12">
                {columns.map((column, colIndex) => (
                // Cada coluna é uma div com as perguntas
                <div key={colIndex} className="flex flex-col space-y-4">
                    {column.map((question) => (
                        // A estrutura de cada linha de pergunta
                        <div key={question.id} className="grid grid-cols-2 gap-4 items-center border-b pb-2">
                            <span className="text-gray-800 font-medium">{question.name}</span>
                            <input
                                type="number"
                                min="1"
                                max="4"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleScoreChange(question.id, parseInt(e.target.value) || 0)}
                                className="w-16 text-center border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white justify-self-start" // Fundo branco
                            />
                        </div>
                    ))}
                </div>
            ))}
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={isPending} // 7. DESABILITA O BOTÃO DURANTE O ENVIO
                    className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {/* 8. MOSTRA TEXTO DE LOADING */}
                    {isPending ? "Enviando..." : "Finalizar Teste"}
                </button>
            </div>
        </main>
    );
}