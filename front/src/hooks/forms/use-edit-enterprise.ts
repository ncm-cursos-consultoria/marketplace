import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/service/api";
import { EnterpriseEditSchema, enterpriseEditSchema } from "@/hooks/schemas/enterprise/enterprise-edit-schema";
import { EnterpriseData } from "@/types/enterprise"; // Importe o tipo da sua página
import { useEffect } from "react";

// Função que chama a API de update
const updateEnterpriseRequest = async ({ enterpriseId, formData }: { enterpriseId: string, formData: EnterpriseEditSchema }) => {
    const { data } = await api.put(`/enterprise/${enterpriseId}`, formData);
    return data;
};

// O Hook customizado
export function useEditEnterprise(
    enterpriseData: EnterpriseData | undefined,
    enterpriseId: string | undefined,
    email: string | undefined,
    setIsEditing: (isEditing: boolean) => void
) {
    const queryClient = useQueryClient();

    const form = useForm<EnterpriseEditSchema>({
        resolver: zodResolver(enterpriseEditSchema),
        // Atualiza todos os valores padrão
        defaultValues: {
            legalName: enterpriseData?.legalName || '',
            tradeName: enterpriseData?.tradeName || '',
            cnpj: enterpriseData?.cnpj?.replace(/\D/g, '') || '',
            email: email || '',
            phone: enterpriseData?.phone || '',
            website: enterpriseData?.website || '',
            missionStatement: enterpriseData?.missionStatement || '',
            coreValues: enterpriseData?.coreValues || '',
            benefits: enterpriseData?.benefits || '',
        }
    });
    const { reset } = form;

    // Atualiza todos os campos no reset
    useEffect(() => {
        if (enterpriseData) {
            reset({
                legalName: enterpriseData.legalName || '',
                tradeName: enterpriseData.tradeName || '',
                cnpj: enterpriseData.cnpj?.replace(/\D/g, '') || '',
                email: email || '',
                phone: enterpriseData.phone || '',
                website: enterpriseData.website || '',
                missionStatement: enterpriseData.missionStatement || '',
                coreValues: enterpriseData.coreValues || '',
                benefits: enterpriseData.benefits || '',
            });
        }
    }, [enterpriseData, reset]);


    // Configura a 'mutação' (chamada PUT para a API)
    const { mutateAsync: updateEnterpriseMutation, isPending } = useMutation({
        mutationFn: (formData: EnterpriseEditSchema) =>
            updateEnterpriseRequest({ enterpriseId: enterpriseId!, formData }), // Passa ID e dados
        onSuccess: () => {
            toast.success("Empresa atualizada com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["enterprise-profile", enterpriseId] }); // Atualiza os dados na tela
            setIsEditing(false); // Sai do modo de edição
        },
        onError: (error) => {
            console.error("Erro ao atualizar empresa:", error)
            toast.error("Erro ao atualizar a empresa. Verifique os dados e tente novamente.");
        }
    });

    // Função que será chamada pelo handleSubmit do formulário
    const onSubmit = (data: EnterpriseEditSchema) => {
        if (!enterpriseId) return; // Segurança extra
        updateEnterpriseMutation(data);
    };

    // Retorna tudo que o componente da página precisa
    return { form, isPending: isPending, onSubmit };
}