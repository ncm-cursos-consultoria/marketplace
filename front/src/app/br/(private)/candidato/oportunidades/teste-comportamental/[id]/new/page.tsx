// front/src/app/disc/new/page.tsx

// Diretiva do Next.js que diz: "Este componente roda no navegador do cliente"
// Isso é necessário para usar 'useState', 'useEffect' e lidar com cliques.
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UseUserCandidate } from '@/context/user-candidate.context'; // 1. Importe o hook do contexto

// Importa as funções que chamam a API (você já as criou!)
import { getAllDiscQuestions } from "@/service/user/disc/get-all-disc-questions"; // Ajuste o caminho se necessário
import { postDisc } from "@/service/user/disc/post-create-disc";

// Tipos para os dados (como DTOs no Java)
interface Question {
    id: string;
    name: string;
}

interface Answers {
    // A chave será o ID da questão, o valor será o score (número)
    [questionId: string]: number;
}

export default function NewDiscTestPage() {
    const { userCandidate } = UseUserCandidate(); // 2. Use o hook para pegar os dados do usuário
    const router = useRouter();

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
                // Aqui você poderia mostrar uma mensagem de erro na tela
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestions();
    }, []); // O `[]` vazio significa "rode este código apenas uma vez"

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

    // Função chamada ao clicar no botão "Finalizar Teste"
    const handleSubmit = async () => {
        // Pega o userId (do contexto de autenticação, por exemplo)
        const userId = userCandidate?.id;

        // Validação: Garante que temos um ID de usuário antes de prosseguir
        if (!userId) {
            alert("Usuário não autenticado. Por favor, faça login novamente.");
            router.push('/auth/sign-in'); // Redireciona para o login
            return;
        }
        // Transforma o objeto de respostas no formato de lista que a API espera
        const formattedAnswers = Object.entries(answers).map(([id, score]) => ({
            id,
            score,
        }));

        // Validação final
        if (formattedAnswers.length !== questions.length) {
            alert("Por favor, responda todas as perguntas.");
            return;
        }

        try {
            await postDisc(userId, { questions: formattedAnswers });
            alert("Teste enviado com sucesso!");
            router.push(`/br/candidato/oportunidades/teste-comportamental/${userId}`); // Redireciona para a página de resultado
        } catch (error) {
            console.error("Falha ao enviar o teste:", error);
            alert("Ocorreu um erro ao enviar seu teste. Tente novamente.");
        }
    };

    if (isLoading) {
        return <main className="p-10">Carregando perguntas...</main>;
    }

    const itemsPerColumn = Math.ceil(questions.length / 4);

    // Cria 4 arrays separados, um para cada coluna
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
                    className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                    Finalizar Teste
                </button>
            </div>
        </main>
    );
}