import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F3' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: 'white', 
        padding: '1rem 2rem', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3D5A80', fontFamily: 'var(--font-playfair)' }}>
            Dynamic Parenting
          </Link>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#3D5A80', fontWeight: '500' }}>Home</Link>
            <Link href="/diensten" style={{ color: '#5B7FA3' }}>Diensten</Link>
            <Link href="/over-mij" style={{ color: '#5B7FA3' }}>Over Mij</Link>
            <Link href="/blog" style={{ color: '#5B7FA3' }}>Blog</Link>
            <Link href="/contact" style={{ color: '#5B7FA3' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EDE4 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ color: '#5B7FA3', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Oudercoaching & Gezinsbegeleiding
          </p>
          <h1 style={{ 
            fontSize: '3rem', 
            color: '#3D5A80', 
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-playfair)',
            lineHeight: 1.2
          }}>
            Bouwen aan Sterkere<br />Gezinsverbindingen
          </h1>
          <p style={{ color: '#5B7FA3', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: 1.8 }}>
            Transformeer je gezinsdynamiek door compassievolle begeleiding, 
            evidence-based coaching en persoonlijke ondersteuning. 
            Elk gezin heeft het potentieel om te bloeien.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/contact" 
              style={{ 
                display: 'inline-block',
                backgroundColor: '#3D5A80', 
                color: 'white', 
                padding: '1rem 2rem', 
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '1.1rem'
              }}
            >
              Gratis Kennismaking
            </Link>
            <Link 
              href="/diensten" 
              style={{ 
                display: 'inline-block',
                backgroundColor: 'transparent', 
                color: '#3D5A80', 
                padding: '1rem 2rem', 
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '1.1rem',
                border: '2px solid #3D5A80'
              }}
            >
              Bekijk Diensten
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2rem', 
            color: '#3D5A80', 
            marginBottom: '1rem',
            fontFamily: 'var(--font-playfair)'
          }}>
            Hoe Ik Kan Helpen
          </h2>
          <p style={{ textAlign: 'center', color: '#5B7FA3', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Samen werken we aan een harmonieuzer gezinsleven
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ backgroundColor: '#FDF8F3', padding: '2rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌳</div>
              <h3 style={{ color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>Genogram</h3>
              <p style={{ color: '#5B7FA3', lineHeight: 1.7 }}>
                Breng de patronen in je familie over generaties in kaart. 
                Ontdek overgeërfde dynamieken, krachten en groeimogelijkheden.
              </p>
            </div>

            <div style={{ backgroundColor: '#FDF8F3', padding: '2rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔄</div>
              <h3 style={{ color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>Systeemtherapie</h3>
              <p style={{ color: '#5B7FA3', lineHeight: 1.7 }}>
                Begrijp je gezin als een verbonden systeem. 
                Werk aan relatiedynamiek en communicatiepatronen.
              </p>
            </div>

            <div style={{ backgroundColor: '#FDF8F3', padding: '2rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
              <h3 style={{ color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>Oudercoaching</h3>
              <p style={{ color: '#5B7FA3', lineHeight: 1.7 }}>
                Praktische strategieën voor dagelijkse opvoeduitdagingen. 
                Bouw zelfvertrouwen op en versterk de band met je kind.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link 
              href="/diensten"
              style={{
                display: 'inline-block',
                color: '#3D5A80',
                fontWeight: '500',
                fontSize: '1.1rem'
              }}
            >
              Alle diensten bekijken →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#F5EDE4' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💬</div>
          <blockquote style={{ fontSize: '1.3rem', color: '#3D5A80', fontStyle: 'italic', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            "Door de sessies heb ik geleerd om anders naar mijn kind te kijken. 
            We begrijpen elkaar nu veel beter en de sfeer thuis is compleet veranderd."
          </blockquote>
          <p style={{ color: '#5B7FA3' }}>— Tevreden ouder</p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: '#3D5A80', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Klaar om de Eerste Stap te Zetten?
        </h2>
        <p style={{ color: '#B8C9DB', marginBottom: '2rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Plan een gratis kennismakingsgesprek van 30 minuten. 
          Vrijblijvend en zonder verplichtingen.
        </p>
        <Link 
          href="/contact"
          style={{
            display: 'inline-block',
            backgroundColor: 'white',
            color: '#3D5A80',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '1.1rem'
          }}
        >
          Plan Gratis Gesprek
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem', backgroundColor: '#2E4A6F', color: '#B8C9DB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem', color: 'white', marginBottom: '0.5rem' }}>
                Dynamic Parenting
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Gezinnen koesteren, één verbinding per keer
              </p>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: '500', marginBottom: '0.5rem' }}>Pagina's</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <Link href="/diensten" style={{ color: '#B8C9DB', fontSize: '0.9rem' }}>Diensten</Link>
                <Link href="/over-mij" style={{ color: '#B8C9DB', fontSize: '0.9rem' }}>Over Mij</Link>
                <Link href="/blog" style={{ color: '#B8C9DB', fontSize: '0.9rem' }}>Blog</Link>
                <Link href="/contact" style={{ color: '#B8C9DB', fontSize: '0.9rem' }}>Contact</Link>
              </div>
            </div>
            <div>
  <h4 style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '0.75rem', fontFamily: 'var(--font-dm-sans)' }}>
    Contact
  </h4>
<p style={{ color: 'white', fontWeight: '500', marginBottom: '0.5rem' }}>Contact</p>
              <p style={{ fontSize: '0.9rem' }}>
                <a href="mailto:info@dynamicparenting.nl" style={{ color: '
#B8C9DB' }}>info@dynamicparenting.nl</a>
              </p>
  </div>
  </div>       
              </p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #3D5A80', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#7A9BBF' }}>
              © 2025 Dynamic Parenting | <Link href="/login" style={{ color: '#7A9BBF' }}>Cliënt login</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
