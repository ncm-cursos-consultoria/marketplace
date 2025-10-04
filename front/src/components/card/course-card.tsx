// components/CourseCard.tsx
interface CourseCardProps {
  title: string;
  description: string;
  video?: string;
  image?: string;
}

export function CourseCard({
  title,
  description,
  video,
  image,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {image && (
        <img src={image} alt={title} className="w-full h-40 object-cover" />
      )}
      {video && (
        <iframe
          width="100%"
          height="250"
          src={video}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded shadow"
        ></iframe>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
