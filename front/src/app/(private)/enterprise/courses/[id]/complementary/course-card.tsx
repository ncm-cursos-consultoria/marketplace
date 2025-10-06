import { PlayCircle } from "lucide-react";
import Image from "next/image";

export type Course = {
  id: string;
  title: string;
  description?: string;
  order: number;
  moduleId: string;
  videoUrl: string;
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="relative h-32 w-full bg-muted">
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <PlayCircle className="h-8 w-8 opacity-60" />
          </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">{course.title}</h3>
        {course.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
        )}
      </div>
    </div>
  );
}
