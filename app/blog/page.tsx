import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock } from 'lucide-react';
import { client, urlFor } from '@/lib/sanity';

export const metadata = {
  title: 'Real Estate Blog | MexicoHomeFinder',
  description: 'Expert advice, guides, and insights on buying property in Mexico.',
};

// Sanity query to get all blog posts
const postsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt,
  featured,
  author->{
    name
  },
  categories[]->{
    title
  }
}`;

export default async function BlogPage() {
  // Fetch posts from Sanity
  const posts = await client.fetch(postsQuery);
  
  // Get featured post (first post marked as featured, or first post)
  const featuredPost = posts.find((post: any) => post.featured) || posts[0];
  
  // Get remaining posts
  const regularPosts = posts.filter((post: any) => post._id !== featuredPost?._id);

  return (
    <>
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-[#b07151] text-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Real Estate Insights & <span className="text-[#314561]">Expert Guides</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Everything you need to know about buying, owning, and enjoying property in Mexico.
              </p>

            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-display font-bold text-primary mb-8">Featured Article</h2>
              
              <Link
                href={`/blog/${featuredPost.slug.current}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  {featuredPost.mainImage && (
                    <div className="relative aspect-[16/10] lg:aspect-auto">
                      <Image
                        src={urlFor(featuredPost.mainImage).width(800).height(500).url()}
                        alt={featuredPost.mainImage.alt || featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      {featuredPost.categories && featuredPost.categories[0] && (
                        <span className="px-3 py-1 bg-secondary text-white text-sm font-semibold uppercase tracking-wider rounded">
                          {featuredPost.categories[0].title}
                        </span>
                      )}
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                      {featuredPost.title}
                    </h3>
                    
                    {featuredPost.excerpt && (
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-secondary font-semibold">
                      Read Article
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-primary mb-8">Latest Articles</h2>
            
            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post: any) => (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug.current}`}
                    className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    {post.mainImage && (
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={urlFor(post.mainImage).width(600).height(400).url()}
                          alt={post.mainImage.alt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {post.categories && post.categories[0] && (
                          <span className="px-2.5 py-1 bg-secondary text-white text-xs font-semibold uppercase tracking-wide rounded">
                            {post.categories[0].title}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
                        Read More
                        <span className="group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-12">No blog posts yet. Create your first post in Sanity Studio!</p>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 px-6 bg-gradient-to-br from-secondary to-secondary-dark text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get our best content delivered to your inbox
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Subscribe to our newsletter for the latest guides, market insights, and property listings.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-4 bg-white text-secondary font-semibold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </form>
            
            <p className="text-sm text-white/70 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}