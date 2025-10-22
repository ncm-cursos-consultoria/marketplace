"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle } from "lucide-react";
import { getModule } from "@/service/module/get-module";
import { getCourses } from "@/service/course/get-courses";
import { CourseCard } from "@/components/course-card";
import { EmptyState } from "@/app/br/(private)/enterprise/courses/[id]/complementary/empty-state";


type Course = {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  videoUrl?: string | null;
  durationInMin?: number | null;
};

type ModuleInfo = {
  id: string;
  title: string;
  description?: string | null;
  coursesCount?: number | null;
};

export default function ModuleCoursesPage() {
  const params = useParams<{ id?: string;}>();
  const moduleId = params?.id || ""

  const {
    data: moduleInfo,
    isLoading: isLoadingModule,
    isError: isErrorModule,
  } = useQuery<ModuleInfo>({
    queryKey: ["module", moduleId],
    queryFn: () => getModule(moduleId),
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useQuery<Course[]>({
    queryKey: ["courses-candidate", moduleId],
    queryFn: () => getCourses(moduleId),
    enabled: !!moduleId,
  });

  console.log("teste",courses);
  

  const isLoading = isLoadingModule || isLoadingCourses;
  const isError = isErrorModule || isErrorCourses;

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] pr-4 lg:pr-0">
        <Header title={moduleInfo?.title} />
        <p className="mb-4 text-sm text-muted-foreground">
          Veja todos os cursos pertencentes a este módulo.
        </p>
        <SkeletonGrid />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[1200px] pr-4 lg:pr-0">
        <Header title={moduleInfo?.title} />
        <p className="mb-4 text-sm text-muted-foreground">
          Veja todos os cursos pertencentes a este módulo.
        </p>
        <EmptyState
          title="Não foi possível carregar os cursos"
          subtitle="Tente novamente em alguns instantes."
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] pr-4 lg:pr-0 p-32">
      <Header title={moduleInfo?.title} />

      <p className="mb-4 text-sm text-muted-foreground">
        {moduleInfo?.description
          ? moduleInfo.description
          : "Veja todos os cursos pertencentes a este módulo."}
      </p>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard course={course} key={course.id}/>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum curso neste módulo"
          subtitle="Adicione cursos para que os alunos possam começar."
        />
      )}
    </div>
  );
}

function Header({ title }: { title?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
        <BookOpen className="h-6 w-6" /> {title ? `Cursos – ${title}` : "Aulas do módulo"}
      </h1>
    </div>
  );
}



function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[260px] animate-pulse rounded-2xl border bg-muted/30" />
      ))}
    </div>
  );
}
