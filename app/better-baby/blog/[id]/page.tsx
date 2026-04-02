// ❌ remove "use client"

import { posts } from "./data";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ unwrap params

  const post = posts.find((p) => p.id === id);

  if (!post) return notFound();

  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section className="relative w-full h-[50vh]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-10 text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              {post.title}
            </h1>
            <p className="text-sm opacity-90">{post.date}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-lg leading-relaxed">{post.content}</p>
      </section>
    </main>
  );
}
