import { Card } from "@/components/enterprise/profile/card";
import { CardHeader } from "@/components/enterprise/profile/card-header";
import { Field } from "@/components/enterprise/profile/field";

export function AddressEnterprise() {
  return (
    <Card>
      <CardHeader
        title="Endereço"
        subtitle="Localização principal da empresa."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Cidade">
          <div></div>
        </Field>
        <Field label="Estado">
          <div></div>
        </Field>
        <Field label="Endereço completo" className="sm:col-span-2">
          <div></div>
        </Field>
      </div>
    </Card>
  );
}
