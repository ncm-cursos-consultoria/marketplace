'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, BookOpen, Layers, PlayCircle, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from './complementary/empty-state'
import { CourseCard } from './complementary/course-card'
import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/service/course/get-courses'
import { useParams } from 'next/navigation'
import { getModule } from '@/service/module/get-module'
import { ModalCreateCourse } from './complementary/modal-create-course'
import { UseUserEnteprise } from '@/context/user-enterprise.context'

export type Course = {
  id: string
  title: string
  description?: string
  coverUrl?: string
  durationInMin?: number
  level?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
}

export type ModuleSummary = {
  id: string
  title: string
  description?: string
  coverUrl?: string
  coursesCount?: number
}

const MODULES_SUMMARY: ModuleSummary[] = [
  { id: 'm1', title: 'Onboarding Devs', description: 'Passo a passo para novos desenvolvedores da empresa.', coursesCount: 4 },
  { id: 'm2', title: 'Vendas & Atendimento', description: 'Rotinas de CRM, processos e playbooks.', coursesCount: 3 },
  { id: 'm3', title: 'Compliance & Segurança', description: 'Políticas internas e boas práticas de segurança.', coursesCount: 2 },
]

const COURSES_BY_MODULE: Record<string, Course[]> = {
  m1: [
    { id: 'c1', title: 'Setup do Ambiente', description: 'Instalações, tokens e padrões do time.', durationInMin: 35, level: 'BASIC' },
    { id: 'c2', title: 'Guia de Commits', description: 'Padrões de mensagem e convenções.', durationInMin: 22, level: 'BASIC' },
    { id: 'c3', title: 'Design System & UI', description: 'Tokens, componentes e A11y.', durationInMin: 41, level: 'INTERMEDIATE' },
    { id: 'c4', title: 'Fluxo de PRs', description: 'Como abrir, revisar e aprovar PRs.', durationInMin: 28, level: 'BASIC' },
  ],
  m2: [
    { id: 'c5', title: 'Pitch & ICP', description: 'Narrativa de valor e ICP.', durationInMin: 30, level: 'BASIC' },
    { id: 'c6', title: 'CRM na Prática', description: 'Funil, cadências e indicadores.', durationInMin: 48, level: 'INTERMEDIATE' },
    { id: 'c7', title: 'Objeções Comuns', description: 'Como mapear e contornar objeções.', durationInMin: 25, level: 'BASIC' },
  ],
  m3: [
    { id: 'c8', title: 'LGPD Essencial', description: 'Bases legais, princípios e papéis.', durationInMin: 37, level: 'BASIC' },
    { id: 'c9', title: 'Segurança Operacional', description: 'Senhas, 2FA, backups e incidentes.', durationInMin: 42, level: 'INTERMEDIATE' },
  ],
}

export default function CoursesByModulePage() {
  const {userEnterprise} = UseUserEnteprise()
  const [search, setSearch] = useState('')
    const params = useParams<{ id: string }>();
    const id = params?.id;
    
  const {data: module, isLoading: isLoadingModule} = useQuery({
    queryKey: ['module'],
    queryFn: () => getModule(id)
  })
  const {data: courses, isLoading} = useQuery({
    queryFn: () => getCourses(id),
    queryKey: ['course']
  })

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return courses
    return courses.filter((c: any) => [c.title, c.description].some((t) => (t || '').toLowerCase().includes(term)))
  }, [courses, search])

  return (
    <div className="w-full pr-4 lg:pr-0 flex items-start justify-between flex-col">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href={`/enterprise/${userEnterprise?.enterpriseId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
            <Layers className="h-6 w-6" /> {module?.title ?? 'Módulo'}
            {typeof module?.coursesCount === 'number' && (
              <Badge variant="secondary" className="ml-1">{module?.coursesCount} curso(s)</Badge>
            )}
          </h1>
          <div>
            <ModalCreateCourse moduleId={id}/>
          </div>
        </div>


      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="relative h-44 w-full bg-muted">
          {module?.coverUrl ? (
            <Image src={module.coverUrl} alt={module.title || ''} fill className="object-cover" sizes="100vw" />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-muted-foreground">
              <Layers className="h-10 w-10 opacity-60" />
            </div>
          )}
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <h2 className="text-xl font-semibold leading-tight">{module?.title ?? 'Módulo'}</h2>
            {module?.description && (
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{module.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{module?.coursesCount ?? 0} curso(s)</Badge>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Cursos do módulo</h2>
        <div className="w-full max-w-sm">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar curso por título ou descrição..." />
        </div>
      </div>

      {filtered > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c: any) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <EmptyState title="Sem cursos neste módulo" subtitle="Adicione um novo curso para começar." />
      )}
    </div>
  )
}
