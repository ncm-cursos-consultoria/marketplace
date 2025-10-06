import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";

interface aboutEnterpriseProps {
  cnpj: string;
}

export function AboutEnterprise({cnpj}: aboutEnterpriseProps) {
  return (
    <Card>
      <CardHeader
        title="Sobre a empresa"
        subtitle="Fale sobre missão, valores e cultura."
      />
      <div>
        <p className="text-neutral-600"> CNPJ {cnpj}</p>
      </div>
    </Card>
  );
}
