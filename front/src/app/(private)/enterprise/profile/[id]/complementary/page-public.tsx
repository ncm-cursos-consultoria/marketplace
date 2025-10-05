import { Card } from "@/components/enterprise/profile/card";

export function PagePublic() {
  return(
                    <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Página pública
                      </p>
                      <p className="text-xs text-gray-600">
                        Veja como os candidatos enxergam seu perfil.
                      </p>
                    </div>
                    <a
                      href="#"
                      className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                    >
                      Visualizar
                    </a>
                  </div>
                </Card>
  )
}