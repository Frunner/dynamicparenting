import Link from 'next/link'
import { notFound } from 'next/navigation'
import { blogPosts } from '@/data/blogPosts'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Niet gevonden' }
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default function BlogPost({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F3' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', padding: '1rem 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', fontFamily: 'var(--font-playfair)' }}>
            Dynamic Parenting
          </Link>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#5B7FA3' }}>Home</Link>
            <Link href="/diensten" style={{ color: '#5B7FA3' }}>Diensten</Link>
            <Link href="/over-mij" style={{ color: '#5B7FA3' }}>Over Mij</Link>
            <Link href="/blog" style={{ color: '#3D5A80', fontWeight: '500' }}>Blog</Link>
            <Link href="/contact" style={{ color: '#5B7FA3' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/blog" style={{ color: '#5B7FA3', marginBottom: '2rem', display: 'inline-block' }}>
            ← Terug naar blog
          </Link>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ backgroundColor: '#3D5A80', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                {post.category}
              </span>
              <span style={{ color: '#999', fontSize: '0.9rem' }}>
                {post.date} • {post.readTime || '5 min lezen'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)', lineHeight: 1.2 }}>
              {post.title}
            </h1>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '3rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div 
              style={{ color: '#444', lineHeight: 1.9, fontSize: '1.05rem' }}
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '</p><p style="margin-bottom: 1.5rem;">').replace(/^/, '<p style="margin-bottom: 1.5rem;">').replace(/$/, '</p>').replace(/## (.*?)(?=\n|$)/g, '</p><h2 style="color: #3D5A80; margin-top: 2rem; margin-bottom: 1rem; font-family: var(--font-playfair); font-size: 1.5rem;">$1</h2><p style="margin-bottom: 1.5rem;">').replace(/### (.*?)(?=\n|$)/g, '</p><h3 style="color: #3D5A80; margin-top: 1.5rem; margin-bottom: 0.75rem; font-family: var(--font-playfair); font-size: 1.2rem;">$1</h3><p style="margin-bottom: 1.5rem;">') }}
            />
          </div>

          {/* CTA Box */}
          <div style={{ backgroundColor: '#3D5A80', borderRadius: '16px', padding: '2rem', marginTop: '3rem', textAlign: 'center' }}>
            <h3 style={{ color: 'white', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>
              Wil je hierover doorpraten?
            </h3>
            <p style={{ color: '#B8C9DB', marginBottom: '1.5rem' }}>
              Plan een gratis kennismakingsgesprek van 30 minuten
            </p>
            <Link 
              href="/contact"
              style={{ display: 'inline-block', backgroundColor: 'white', color: '#3D5A80', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '500' }}
            >
              Neem Contact Op
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer style={{ padding: '2rem', backgroundColor: '#2E4A6F', color: '#B8C9DB', textAlign: 'center' }}>
        <p>© 2025 Dynamic Parenting | <Link href="/login" style={{ color: '#7A9BBF' }}>Cliënt login</Link></p>
      </footer>
    </div>
  )
}
