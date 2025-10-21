import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { Label } from "@/components/ui/label";
// 1. Importe os tipos do react-hook-form
import { UseFormRegister, FieldErrors } from "react-hook-form";
// 2. Importe o tipo do seu Schema de edição
import { EnterpriseEditSchema } from "@/hooks/schemas/enterprise/enterprise-edit-schema"; // Ajuste o caminho se necessário

// 3. Atualize a interface de props
interface AboutEnterpriseProps {
  mission?: string | null;
  values?: string | null;
  benefits?: string | null;
  isEditing: boolean;
  register: UseFormRegister<EnterpriseEditSchema>; // <-- ADICIONE
  errors: FieldErrors<EnterpriseEditSchema>;     // <-- ADICIONE
}

// 4. Receba as novas props
export function AboutEnterprise({ 
  mission, 
  values, 
  benefits, 
  isEditing, 
  register, 
  errors 
}: AboutEnterpriseProps) {

  const hasContent = !!(mission || values || benefits);

  return (
    <Card>
      <CardHeader
        title="Sobre a empresa"
        subtitle="Missão, valores e benefícios."
      />
      <div className="mt-4 space-y-4 text-sm text-neutral-700">
        {isEditing ? (
          <div className="space-y-4">
            {/* 5. Conecte os campos ao formulário */}
            <div>
              <Label htmlFor="missionStatement">Missão</Label>
              <textarea
                id="missionStatement"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                {...register("missionStatement")} // <-- USE O 'register'
              />
              {errors.missionStatement && <p className="text-red-500 text-xs mt-1">{errors.missionStatement.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="coreValues">Valores</Label>
              <textarea id="coreValues" rows={3} {...register("coreValues")} />
              {errors.coreValues && <p className="text-red-500 text-xs mt-1">{errors.coreValues.message}</p>}
            </div>

            <div>
              <Label htmlFor="benefits">Sobre</Label>
              <textarea id="benefits" rows={3} {...register("benefits")} />
              {errors.benefits && <p className="text-red-500 text-xs mt-1">{errors.benefits.message}</p>}
            </div>
          </div>
        ) : (
          // Modo de Visualização (adicionando 'whitespace-pre-wrap' para formatar)
          <>
            {hasContent ? (
              <div className="space-y-3">
                {mission && (
                  <div>
                    <h4 className="font-semibold text-neutral-800">Nossa Missão</h4>
                    <p className="text-neutral-600 whitespace-pre-wrap">{mission}</p>
                  </div>
                )}
                {values && (
                  <div>
                    <h4 className="font-semibold text-neutral-800">Nossos Valores</h4>
                    <p className="text-neutral-600 whitespace-pre-wrap">{values}</p>
                  </div>
                )}
                 {benefits && (
                  <div>
                    <h4 className="font-semibold text-neutral-800">Sobre</h4>
                    <p className="text-neutral-600 whitespace-pre-wrap">{benefits}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-neutral-500">Nenhuma informação sobre a empresa foi adicionada ainda.</p>
            )}
          </>
        )}
      </div>
    </Card>
  );
}