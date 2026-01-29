import Link from 'next/link'

export default function OverMij() {
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
            <Link href="/" style={{ color: '#5B7FA3' }}>Home</Link>
            <Link href="/diensten" style={{ color: '#5B7FA3' }}>Diensten</Link>
            <Link href="/over-mij" style={{ color: '#3D5A80', fontWeight: '500' }}>Over Mij</Link>
            <Link href="/blog" style={{ color: '#5B7FA3' }}>Blog</Link>
            <Link href="/contact" style={{ color: '#5B7FA3' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section met Foto */}
      <section style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EDE4 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src="/Walter.jpeg" 
            alt="Walter Zantinge"
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '1.5rem',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <p style={{ color: '#5B7FA3', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            Systeemcoach voor Ouders & Gezinnen
          </p>
          <h1 style={{ 
            fontSize: '2.5rem', 
            color: '#3D5A80', 
            marginBottom: '1rem',
            fontFamily: 'var(--font-playfair)',
            lineHeight: 1.2
          }}>
            Walter Zantinge
          </h1>
          <p style={{ color: '#5B7FA3', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            Als systeemcoach help ik ouders en gezinnen om sterke, liefdevolle verbindingen op te bouwen. 
            Mijn aanpak combineert systemisch denken met praktische, direct toepasbare strategieën.
          </p>
        </div>
      </section>

      {/* Mijn Visie */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            color: '#3D5A80', 
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-playfair)',
            textAlign: 'center'
          }}>
            Mijn Visie
          </h2>
          <p style={{ color: '#5B7FA3', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1rem' }}>
            Ik geloof dat elk gezin uniek is. Er bestaan geen standaardoplossingen die voor iedereen werken. 
            Daarom werk ik altijd vanuit jouw specifieke situatie, met respect voor jullie waarden en dynamiek.
          </p>
          <p style={{ color: '#5B7FA3', fontSize: '1.1rem', lineHeight: 1.8 }}>
            Gezinnen zijn complexe systemen waarin iedereen elkaar beïnvloedt. 
            Wanneer we begrijpen hoe deze patronen werken, ontstaat er ruimte voor echte verandering.
          </p>
        </div>
      </section>

      {/* Wat Ik Belangrijk Vind */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#F5EDE4' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            color: '#3D5A80', 
            marginBottom: '2rem',
            fontFamily: 'var(--font-playfair)',
            textAlign: 'center'
          }}>
            Wat Ik Belangrijk Vind
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
              <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>Groei</h3>
              <p style={{ color: '#5B7FA3', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Elk gezin kan groeien en bloeien, ongeacht de startpositie
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤝</div>
              <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>Verbinding</h3>
              <p style={{ color: '#5B7FA3', fontSize: '0.95rem', lineHeight: 1.6 }}>
                De relatie tussen ouder en kind is de basis van alles
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
              <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>Kracht</h3>
              <p style={{ color: '#5B7FA3', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Focus op wat al goed gaat en bouw daarop verder
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
              <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>Systeem</h3>
              <p style={{ color: '#5B7FA3', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Begrijp het geheel om het individu te ondersteunen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mijn Aanpak */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            color: '#3D5A80', 
            marginBottom: '2rem',
            fontFamily: 'var(--font-playfair)',
            textAlign: 'center'
          }}>
            Mijn Aanpak
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#FDF8F3', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3D5A80' }}>
              <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>Systemisch kijken</h3>
              <p style={{ color: '#5B7FA3', lineHeight: 1.7 }}>
                Ik kijk niet naar losse problemen, maar naar het geheel. 
                Hoe verhouden gezinsleden zich tot elkaar? Welke patronen herhalen zich?
              </p>
            </div>
            <div style={{ backgroundColor: '#FDF8F3', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3D5A80' }}>
              <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>Praktisch werken</h3>
              <p style={{ color: '#5B7FA3', lineHeight: 1.7 }}>
                Inzicht alleen is niet genoeg. Ik geef je concrete handvatten die je direct kunt toepassen in het dagelijks leven.
              </p>
            </div>
            <div style={{ backgroundColor: '#FDF8F3', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3D5A80' }}>
              <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>Samen ontdekken</h3>
              <p style={{ color: '#5B7FA3', lineHeight: 1.7 }}>
                Jij kent je gezin het beste. Ik begeleid je om zelf de oplossingen te vinden die bij jullie passen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Voor Wie */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#F5EDE4' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            color: '#3D5A80', 
            marginBottom: '2rem',
            fontFamily: 'var(--font-playfair)'
          }}>
            Voor Wie
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', textAlign: 'left' }}>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍👩‍👧</span>
              <span style={{ color: '#5B7FA3' }}>Ouders die worstelen met de opvoeding</span>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔁</span>
              <span style={{ color: '#5B7FA3' }}>Gezinnen die vastlopen in terugkerende conflicten</span>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>❤️</span>
              <span style={{ color: '#5B7FA3' }}>Ouders die de band met hun kind willen versterken</span>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🏠</span>
              <span style={{ color: '#5B7FA3' }}>Gezinnen in transitie (scheiding, samengesteld gezin)</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#3D5A80', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Eerste Stap
        </h2>
        <p style={{ color: '#B8C9DB', marginBottom: '2rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Benieuwd of ik iets voor jullie kan betekenen? Plan een gratis kennismakingsgesprek. 
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
              <p style={{ color: 'white', fontWeight: '500', marginBottom: '0.5rem' }}>Contact</p>
              <p style={{ fontSize: '0.9rem' }}>
                <a href="mailto:info@dynamicparenting.nl" style={{ color: '#B8C9DB' }}>info@dynamicparenting.nl</a>
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
