// components/CourseCard.tsx
interface CourseCardProps {
  title: string;
  description: string;
  image: string;
}

export function CourseCard({ title, description, image }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
