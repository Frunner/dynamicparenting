import Link from 'next/link'

export const metadata = {
  title: 'Over Mij',
  description: 'Maak kennis met de mens achter Dynamic Parenting. Mijn achtergrond, visie en werkwijze in oudercoaching en gezinsbegeleiding.',
}

export default function OverMijPage() {
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
            <Link href="/over-mij" style={{ color: '#3D5A80', fontWeight: '500' }}>Over Mij</Link>
            <Link href="/blog" style={{ color: '#5B7FA3' }}>Blog</Link>
            <Link href="/contact" style={{ color: '#5B7FA3' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '4rem 2rem', background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EDE4 100%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
            Over Mij
          </h1>
          <p style={{ color: '#5B7FA3', fontSize: '1.1rem' }}>
            Passie voor gezinnen, gefundeerd in ervaring
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '3rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '150px', height: '150px', backgroundColor: '#F5EDE4', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                👤
              </div>
            </div>

            <h2 style={{ color: '#3D5A80', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)', fontSize: '1.8rem', textAlign: 'center' }}>
              Welkom bij Dynamic Parenting
            </h2>

            <div style={{ color: '#5B7FA3', lineHeight: 1.9, fontSize: '1.05rem' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Als oudercoach en gezinsbegeleider help ik ouders en gezinnen om sterke, 
                liefdevolle verbindingen op te bouwen. Mijn aanpak combineert systemisch 
                denken met praktische, direct toepasbare strategieën.
              </p>

              <p style={{ marginBottom: '1.5rem' }}>
                Ik geloof dat elk gezin uniek is en dat er geen one-size-fits-all oplossingen 
                bestaan. Daarom werk ik altijd vanuit jouw specifieke situatie, met respect 
                voor jullie waarden en dynamiek.
              </p>

              <h3 style={{ color: '#3D5A80', marginTop: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>
                Mijn Werkwijze
              </h3>

              <p style={{ marginBottom: '1.5rem' }}>
                In mijn sessies creëer ik een veilige ruimte waar je vrijuit kunt delen. 
                Samen onderzoeken we patronen, ontdekken we nieuwe perspectieven en werken 
                we aan concrete verbeteringen. Ik geloof in de kracht van kleine stappen 
                die leiden tot grote veranderingen.
              </p>

              <h3 style={{ color: '#3D5A80', marginTop: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>
                Wat Ik Belangrijk Vind
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <span style={{ color: '#3D5A80' }}>🌱</span>
                  <span><strong style={{ color: '#3D5A80' }}>Groei</strong> — Elk gezin kan groeien en bloeien, ongeacht de startpositie</span>
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <span style={{ color: '#3D5A80' }}>🤝</span>
                  <span><strong style={{ color: '#3D5A80' }}>Verbinding</strong> — De relatie tussen ouder en kind is de basis van alles</span>
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <span style={{ color: '#3D5A80' }}>💪</span>
                  <span><strong style={{ color: '#3D5A80' }}>Kracht</strong> — Focus op wat al goed gaat en bouw daarop verder</span>
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <span style={{ color: '#3D5A80' }}>🔄</span>
                  <span><strong style={{ color: '#3D5A80' }}>Systeem</strong> — Begrijp het geheel om het individu te ondersteunen</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#3D5A80', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Laten We Kennismaken
        </h2>
        <p style={{ color: '#B8C9DB', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Benieuwd hoe ik jou en je gezin kan helpen? Plan een vrijblijvend gesprek.
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
