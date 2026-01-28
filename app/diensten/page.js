import Link from 'next/link'

export const metadata = {
  title: 'Diensten',
  description: 'Ontdek mijn diensten: oudercoaching, systeemtherapie, genogrammen en gezinsbegeleiding. Professionele hulp voor sterke gezinsrelaties.',
}

export default function DienstenPage() {
  const diensten = [
    {
      icon: '🌳',
      title: 'Genogram Sessie',
      description: 'Een visuele stamboom die verder gaat dan namen en data. We brengen emotionele patronen, relaties en terugkerende thema\'s door generaties heen in kaart.',
      duur: '90 minuten',
      prijs: '€ 125',
      items: ['Voorbereiding met vragenlijst', 'Interactieve sessie', 'Visueel genogram', 'Nabespreking en inzichten']
    },
    {
      icon: '🔄',
      title: 'Systeemtherapie',
      description: 'Begrijp je gezin als een verbonden systeem waarin elk lid invloed heeft op het geheel. Samen werken we aan gezondere dynamieken.',
      duur: '60 minuten',
      prijs: '€ 95',
      items: ['Analyse gezinssysteem', 'Communicatiepatronen', 'Rolverdeling', 'Praktische oefeningen']
    },
    {
      icon: '💡',
      title: 'Oudercoaching',
      description: 'Praktische begeleiding bij dagelijkse opvoedvragen. Van grenzen stellen tot verbinding maken, van driftbuien tot tienergedrag.',
      duur: '60 minuten',
      prijs: '€ 85',
      items: ['Concrete strategieën', 'Op maat advies', 'Oefeningen voor thuis', 'Tussentijdse ondersteuning']
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Co-ouderschap Begeleiding',
      description: 'Ondersteuning voor gescheiden ouders die samen het beste voor hun kinderen willen. Werk aan effectieve communicatie en afspraken.',
      duur: '75 minuten',
      prijs: '€ 110',
      items: ['Communicatie verbeteren', 'Afspraken maken', 'Conflicthantering', 'Focus op het kind']
    },
  ]

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
            <Link href="/diensten" style={{ color: '#3D5A80', fontWeight: '500' }}>Diensten</Link>
            <Link href="/over-mij" style={{ color: '#5B7FA3' }}>Over Mij</Link>
            <Link href="/blog" style={{ color: '#5B7FA3' }}>Blog</Link>
            <Link href="/contact" style={{ color: '#5B7FA3' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EDE4 100%)' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Mijn Diensten
        </h1>
        <p style={{ color: '#5B7FA3', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Professionele begeleiding op maat, afgestemd op jouw gezinssituatie
        </p>
      </section>

      {/* Services */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {diensten.map((dienst, index) => (
              <div key={index} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '280px' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{dienst.icon}</div>
                    <h2 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)', fontSize: '1.5rem' }}>{dienst.title}</h2>
                    <p style={{ color: '#5B7FA3', marginBottom: '1rem', lineHeight: 1.7 }}>{dienst.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <span style={{ backgroundColor: '#F5EDE4', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', color: '#3D5A80' }}>
                        ⏱ {dienst.duur}
                      </span>
                      <span style={{ backgroundColor: '#3D5A80', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', color: 'white' }}>
                        {dienst.prijs}
                      </span>
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '200px' }}>
                    <p style={{ fontWeight: '500', color: '#3D5A80', marginBottom: '0.5rem' }}>Wat je krijgt:</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {dienst.items.map((item, i) => (
                        <li key={i} style={{ color: '#5B7FA3', padding: '0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: '#3D5A80' }}>✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#3D5A80', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Niet zeker welke dienst bij je past?
        </h2>
        <p style={{ color: '#B8C9DB', marginBottom: '2rem' }}>
          Plan een gratis kennismakingsgesprek van 30 minuten
        </p>
        <Link href="/contact" style={{ display: 'inline-block', backgroundColor: 'white', color: '#3D5A80', padding: '1rem 2rem', borderRadius: '8px', fontWeight: '500' }}>
          Plan Gratis Gesprek
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', backgroundColor: '#2E4A6F', color: '#B8C9DB', textAlign: 'center' }}>
        <p>© 2025 Dynamic Parenting | <Link href="/login" style={{ color: '#7A9BBF' }}>Cliënt login</Link></p>
      </footer>
    </div>
  )
}
