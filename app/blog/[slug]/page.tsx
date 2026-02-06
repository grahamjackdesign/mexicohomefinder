import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, Clock, User, ArrowLeft, Share2, BookmarkPlus } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
    return posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error fetching posts for static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt
    }`,
    { slug }
  );

  if (!post) {
    return {
      title: 'Post Not Found | MexicoHomeFinder',
    };
  }

  return {
    title: `${post.title} | MexicoHomeFinder`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Fetch the blog post from Sanity
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      body,
      publishedAt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
      author->{
        name,
        image
      },
      categories[]->{
        title
      }
    }`,
    { slug }
  );

  // If no post found, show 404
  if (!post) {
    notFound();
  }

  // Fetch related posts (from same category or just recent)
  const relatedPosts = await client.fetch(
    `*[_type == "post" && slug.current != $slug][0...3]{
      title,
      slug,
      mainImage,
      excerpt,
      "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
      categories[]->{
        title
      }
    }`,
    { slug }
  );

  const readTime = post.estimatedReadingTime || 5;

  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <article className="relative">
          {/* Featured Image */}
          <div className="relative h-[60vh] md:h-[70vh]">
            {post.mainImage ? (
              <Image
                src={urlFor(post.mainImage).width(1200).height(800).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Breadcrumb & Actions */}
            <div className="absolute top-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <Link 
                  href="/blog"
                  className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Blog
                </Link>
                
                <div className="flex items-center gap-3">
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors text-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors text-white">
                    <BookmarkPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Title & Meta */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {post.categories && post.categories.length > 0 && (
                    <span className="px-3 py-1 bg-secondary text-white text-sm font-semibold uppercase tracking-wider rounded">
                      {post.categories[0].title}
                    </span>
                  )}
                  <span className="text-white/80 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {readTime} min read
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>
                
                {post.author && (
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                      {post.author.image ? (
                        <Image
                          src={urlFor(post.author.image).width(100).height(100).url()}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-white text-xl font-bold">
                          {post.author.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{post.author.name}</p>
                      <p className="text-white/70 text-sm">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-white">
            <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">
              {/* Lead Paragraph */}
              {post.excerpt && (
                <div className="text-xl text-gray-700 leading-relaxed mb-12 font-light border-l-4 border-secondary pl-6">
                  {post.excerpt}
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-primary prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6">
                <PortableText 
                  value={post.body}
                  components={{
                    types: {
                      image: ({value}) => (
                        <div className="relative w-full h-96 my-8 rounded-lg overflow-hidden">
                          <Image
                            src={urlFor(value).width(800).url()}
                            alt={value.alt || 'Blog image'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ),
                    },
                    marks: {
                      link: ({children, value}) => {
                        const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
                        return (
                          <a href={value.href} rel={rel} className="text-secondary hover:text-secondary-dark underline">
                            {children}
                          </a>
                        )
                      },
                    },
                  }}
                />
              </div>

              {/* CTA Box */}
              <div className="mt-16 bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-8 md:p-10 text-white">
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                  Ready to find your dream home in Mexico?
                </h3>
                <p className="text-white/90 mb-6 text-lg">
                  Browse our curated selection of properties across Mexico's most desirable locations, all listed by trusted local agents.
                </p>
                <Link
                  href="/properties"
                  className="inline-block px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className="bg-gray-50 py-20 px-6 md:px-8">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-10">
                  Related Articles
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost: any) => (
                    <Link
                      key={relatedPost.slug.current}
                      href={`/blog/${relatedPost.slug.current}`}
                      className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative aspect-[16/10]">
                        {relatedPost.mainImage ? (
                          <Image
                            src={urlFor(relatedPost.mainImage).width(400).height(250).url()}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {relatedPost.categories && relatedPost.categories.length > 0 && (
                            <span className="px-2.5 py-1 bg-secondary text-white text-xs font-semibold uppercase tracking-wide rounded">
                              {relatedPost.categories[0].title}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">{relatedPost.estimatedReadingTime || 5} min read</span>
                        </div>
                        <h3 className="font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}
