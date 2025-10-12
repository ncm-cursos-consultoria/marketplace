// Página estática inspirada na listagem de oportunidades
// Fonte de dados: Relatório DISC — Sr. Nivaldo Menezes (PDF)
// — Apenas o conteúdo principal; o <aside> já existe no layout.tsx

export default function Page() {
  // ====== DADOS ESTÁTICOS (extraídos do PDF) ======
  const meta = {
    nome: "Sr. Nivaldo Menezes",
    data: "23/05/2020",
    origem: "HRT-Adizes",
    titulo: "DISC — Resultado do Teste Comportamental- (DOMINANTE)",
  } as const;

  const voceNoDISC = [
    "Sua participação em uma equipe será bastante objetiva e focada em resultados. Atenção: Nivaldo provavelmente tem a tendência de competir pelo poder, mesmo que não se dê conta disso.",
    "Sua natureza investigativa, cética e talvez um tanto reservada pode fazer com que as pessoas não se aproximem e isso pode ser um problema na equipe. Na medida em que isso se aplicar à sua realidade, deve praticar a comunicação e a interação social.",
    "Nivaldo normalmente gosta de trabalhar com pessoas de postura estável, previsível, perfeccionista e cumpridora de normas, pois sente que essas pessoas podem lhe completar.",
    "Não aprecia muito ter que trabalhar com pessoas de postura parecida, principalmente se houver muita proximidade.",
  ] as const;

  const mascaraPostural = [
    "Nivaldo é uma pessoa que responde rapidamente a desafios sendo também muito rápida, inquieta mesmo. Ele parece demonstrar uma capacidade natural de liderança. Parece também ser um indivíduo organizado e resolvido.",
    "Tudo indica que tem um estilo prático na vida. Sua mente está repleta de novas idéias, contribuições e sugestões, é uma pessoa obstinada, não só pensa, mas também realiza. Gosta de ter controle sobre tudo, conhecer, ler e informar-se.",
    "Nivaldo é, em geral, um indivíduo bastante competitivo, almejando ultrapassar barreiras. Suas atividades têm sempre um objetivo, sua energia parece ser inesgotável.",
    "Demonstra inquietação o que por vezes pode assustar pessoas com postura mais tranquila. Nivaldo não vacila sob pressão, nem se amedronta com as adversidades, mostra uma firmeza inabalável e frequentemente obtém sucesso onde os demais fracassaram, devido também ao seu foco em resultados e sua adaptabilidade.",
  ] as const;

  const intimo = [
    "Embora seja um indivíduo bastante ativo e com características positivas, ele também pode apresentar pontos fracos relacionados ao estilo genioso, impetuoso e independente, além de certa aspereza e insensibilidade no trato com as pessoas.",
    "Há indicadores de que também pode algumas vezes apresentar um humor cortante e sarcástico. Nesses momentos os outros talvez o vejam como uma pessoa arrogante e egocêntrica. Uma reflexão sobre esses pontos pode ser interessante.",
  ] as const;

  const posturaUsual = [
    "Nivaldo se sente motivado por situações que exijam o uso de análise lógica e sente-se desafiado pelo inusitado das situações diferentes.",
    "Usa seus contatos sociais como um meio para chegar à um fim, e não é um indivíduo facilmente influenciável.",
    "Pode também pecar pelo excesso diante da necessidade de competir, pois não suporta o fracasso, sendo exigente com os demais da mesma forma que é consigo.",
    "Aparentemente é uma pessoa cética, investigativa e voltada a fatos e coisas concretas.",
    "Pode usar de sarcasmo e rudeza no trato com os outros até mesmo de forma inconsciente.",
  ] as const;

  const aconselhamento = [
    "Sua área de atenção predominante, muito provavelmente, é o orgulho, por isso uma sugestão é que talvez Nivaldo deva treinar sua humildade e paciência, escutando e demonstrando interesse nas opiniões alheias.",
    "Um ponto adicional para sua reflexão é a questão da competitividade exacerbada, pois isso pode lhe prejudicar tanto física como emocionalmente.",
    "É importante lembrar que não é preciso ser sempre o primeiro, nem superar seus próprios limites a todo momento.",
  ] as const;

  // ====== UI ======
  return (
    <main className="p-6 lg:p-10 space-y-8">
      {/* Cabeçalho */}
      <header className="space-y-1">
        <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
          {meta.titulo}
        </h1>
        <p className="text-gray-600">Relatório Postural Expandido</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Info label="Nome" value={meta.nome} />
          <Info label="Data" value={meta.data} />
          <Info label="Origem" value={meta.origem} />
        </div>
      </header>

      {/* Você no DISC */}
      <Section title="Você no DISC" badge="PERFIL">
        {voceNoDISC.map((p) => (
          <p key={p} className="text-sm text-gray-700">{p}</p>
        ))}
      </Section>

      {/* Máscara Postural */}
      <Section title="Máscara Postural" badge="POSTURA">
        {mascaraPostural.map((p) => (
          <p key={p} className="text-sm text-gray-700">{p}</p>
        ))}
        <p className="text-xs text-gray-500 mt-2">* O gráfico DISC original do relatório não está incluído nesta página estática.</p>
      </Section>

      {/* Íntimo */}
      <Section title="Íntimo" badge="PESSOAL">
        {intimo.map((p) => (
          <p key={p} className="text-sm text-gray-700">{p}</p>
        ))}
      </Section>

      {/* Postura Usual */}
      <Section title="Postura Usual" badge="HABITUAL">
        {posturaUsual.map((p) => (
          <p key={p} className="text-sm text-gray-700">{p}</p>
        ))}
      </Section>

      {/* Aconselhamento Adicional */}
      <Section title="Aconselhamento Adicional" badge="SUGESTÃO">
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {aconselhamento.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Section>

      {/* Rodapé simples */}
      <footer className="pt-4 text-xs text-gray-500">
        Fonte: Relatório DISC — Sr. Nivaldo Menezes. Conteúdo exibido de forma estática.
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <article className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div />
          {badge ? (
            <span className="text-[10px] leading-5 rounded-full border px-2 py-0.5 text-blue-700 bg-blue-50">{badge}</span>
          ) : null}
        </div>
        <div className="mt-2 space-y-2">{children}</div>
      </article>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-gray-50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{value}</div>
    </div>
  );
}
