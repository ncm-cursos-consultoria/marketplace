'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Layers } from 'lucide-react'
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
import { UseUserMentor } from '@/context/user-mentor.context'

export default function CoursesByModulePage() {
  const { userMentor } = UseUserMentor()
  const [search, setSearch] = useState('')
  const params = useParams<{ id: string, courseId: string }>()
  const courseId = params?.courseId ?? '' // Agora você usa o ID do curso corretamente
  const mentorId = params?.id ?? ''

  const {
    data: module,
    isLoading: isLoadingModule,
  } = useQuery({
    queryKey: ['module', courseId], // Use o ID do curso/módulo aqui
    queryFn: () => getModule(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  })

  const {
    data: courses = [],
    isLoading: isLoadingCourses,
  } = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => getCourses(courseId),
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5,
  })

  const filtered = useMemo(() => {
    const list = Array.isArray(courses) ? courses : []
    const term = search.trim().toLowerCase()
    if (!term) return list
    return list.filter((c) =>
      [c.title, c.description].some((t) => (t || '').toLowerCase().includes(term)),
    )
  }, [courses, search])

  const sortedList = useMemo(() => {
    if (!filtered) return [];
    // 1. Fazemos uma cópia com [...lista] para não mutar o estado original
    return [...(filtered || [])].sort((a, b) => {
      // 2. Convertemos para Date para comparar matematicamente
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      // 3. B - A = Ordem Decrescente (Mais novo primeiro)
      return dateA - dateB;
    });
  }, [filtered]);

  const totalCourses = courses.length

  return (
    <div className="w-full pr-4 lg:pr-0 flex items-start justify-between flex-col p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between w-full gap-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Link href={`/br/mentor/${userMentor?.id}/module`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
            </Link>

            <h1 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
              <Layers className="h-6 w-6" /> {module?.title ?? 'Módulo'}
              <Badge variant="secondary" className="ml-1">
                {totalCourses} aula(s)
              </Badge>
            </h1>
          </div>

          {/* BOTÃO ATIVADO AQUI */}
          <ModalCreateCourse
            moduleId={courseId}
            title=''
            description=''
            videoUrl=''
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Aulas do curso</h2>
        <div className="w-full max-w-sm">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar curso por título ou descrição..."
          />
        </div>
      </div>

      {(isLoadingModule || isLoadingCourses) && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {!isLoadingModule && !isLoadingCourses && (
        <>
          {sortedList.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sortedList.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sem cursos neste módulo"
              subtitle="Adicione um novo curso para começar."
            />
          )}
        </>
      )}
    </div>
  )
}
