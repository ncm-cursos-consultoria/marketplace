import { api } from "../api";

/**
 * Busca o PDF do certificado de um curso (aula) isolado.
 * Mantido por compatibilidade - o app agora usa downloadCertificateForModule.
 */
export const downloadCertificate = async (courseId: string) => {
  try {
    const res = await api.get(`/certificate/course/${courseId}`, {
      responseType: "blob",
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Busca o PDF do certificado de conclusão do MÓDULO inteiro.
 * O backend exige que todas as aulas (cursos) do módulo estejam concluídas
 * pelo candidato autenticado, e que o plano seja STANDARD ou superior.
 *
 * Erros esperados:
 * - 403: plano do candidato não permite emissão de certificado
 * - 400: ainda existem aulas do módulo não concluídas
 */
export const downloadCertificateForModule = async (moduleId: string) => {
  try {
    const res = await api.get(`/certificate/module/${moduleId}`, {
      responseType: "blob",
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};