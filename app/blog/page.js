import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'

export const metadata = {
  title: 'Blog',
  description: 'Tips en inzichten over ouderschap, opvoeding, co-ouderschap en gezinsdynamiek. Lees onze artikelen over oudercoaching.',
}

export default function BlogPage() {
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

      {/* Hero */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EDE4 100%)' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Blog
        </h1>
        <p style={{ color: '#5B7FA3', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Inspiratie, tips en inzichten over ouderschap en gezinsdynamiek
        </p>
      </section>

      {/* Blog Posts */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {blogPosts.map((post) => (
              <article key={post.slug} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: '#F5EDE4', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', color: '#3D5A80' }}>
                      {post.category}
                    </span>
                    <span style={{ color: '#999', fontSize: '0.8rem' }}>
                      {post.date}
                    </span>
                  </div>
                  <h2 style={{ color: '#3D5A80', marginBottom: '0.75rem', fontFamily: 'var(--font-playfair)', fontSize: '1.3rem', lineHeight: 1.3 }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit' }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ color: '#5B7FA3', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    style={{ color: '#3D5A80', fontWeight: '500', fontSize: '0.95rem' }}
                  >
                    Lees meer →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#3D5A80', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Persoonlijk advies nodig?
        </h2>
        <p style={{ color: '#B8C9DB', marginBottom: '2rem' }}>
          Plan een gratis kennismakingsgesprek van 30 minuten
        </p>
        <Link href="/contact" style={{ display: 'inline-block', backgroundColor: 'white', color: '#3D5A80', padding: '1rem 2rem', borderRadius: '8px', fontWeight: '500' }}>
          Neem Contact Op
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', backgroundColor: '#2E4A6F', color: '#B8C9DB', textAlign: 'center' }}>
        <p>© 2025 Dynamic Parenting | <Link href="/login" style={{ color: '#7A9BBF' }}>Cliënt login</Link></p>
      </footer>
    </div>
  )
}
