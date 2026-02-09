import Link from 'next/link'

export const metadata = {
  title: 'Contact',
  description: 'Neem contact op voor oudercoaching en gezinsbegeleiding. Plan een gratis kennismakingsgesprek van 30 minuten.',
}

export default function ContactPage() {
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
            <Link href="/blog" style={{ color: '#5B7FA3' }}>Blog</Link>
            <Link href="/contact" style={{ color: '#3D5A80', fontWeight: '500' }}>Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #FDF8F3 0%, #F5EDE4 100%)' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#3D5A80', marginBottom: '1rem', fontFamily: 'var(--font-playfair)' }}>
          Contact
        </h1>
        <p style={{ color: '#5B7FA3', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          Heb je vragen of wil je een afspraak maken? Neem gerust contact op.
        </p>
      </section>

      {/* Content */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Contact Info */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h2 style={{ color: '#3D5A80', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)', fontSize: '1.5rem' }}>
                Contactgegevens
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📧</span>
                  <div>
                    <p style={{ color: '#3D5A80', fontWeight: '500' }}>E-mail</p>
                    <a href="mailto:info@dynamicparenting.nl" style={{ color: '#5B7FA3' }}>info@dynamicparenting.nl</a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📍</span>
                  <div>
                    <p style={{ color: '#3D5A80', fontWeight: '500' }}>Locatie</p>
                    <p style={{ color: '#5B7FA3' }}>Online & Amsterdam, Nieuwendammerkade 22D1</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⏰</span>
                  <div>
                    <p style={{ color: '#3D5A80', fontWeight: '500' }}>Reactietijd</p>
                    <p style={{ color: '#5B7FA3' }}>Binnen 24 uur</p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F5EDE4', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem' }}>
                <h3 style={{ color: '#3D5A80', marginBottom: '0.5rem', fontFamily: 'var(--font-playfair)' }}>
                  💬 Gratis Kennismaking
                </h3>
                <p style={{ color: '#5B7FA3', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  Plan een vrijblijvend gesprek van 30 minuten om te ontdekken hoe ik je kan helpen.
                </p>
                <a 
                  href="mailto:info@dynamicparenting.nl?subject=Aanvraag%20Kennismakingsgesprek"
                  style={{ 
                    display: 'inline-block',
                    backgroundColor: '#3D5A80', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '0.95rem'
                  }}
                >
                  Plan Gesprek →
                </a>
              </div>
            </div>

            {/* FAQ */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h2 style={{ color: '#3D5A80', marginBottom: '1.5rem', fontFamily: 'var(--font-playfair)', fontSize: '1.5rem' }}>
                Veelgestelde Vragen
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#3D5A80', marginBottom: '0.5rem' }}>Hoe snel kan ik terecht?</h4>
                <p style={{ color: '#5B7FA3', fontSize: '0.95rem' }}>
                  Meestal binnen 1-2 weken. Bij urgente situaties probeer ik eerder ruimte te maken.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#3D5A80', marginBottom: '0.5rem' }}>Werk je ook online?</h4>
                <p style={{ color: '#5B7FA3', fontSize: '0.95rem' }}>
                  Ja, sessies kunnen zowel online als op locatie plaatsvinden, afhankelijk van jouw voorkeur.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#3D5A80', marginBottom: '0.5rem' }}>Wordt coaching vergoed?</h4>
                <p style={{ color: '#5B7FA3', fontSize: '0.95rem' }}>
                  Sommige aanvullende verzekeringen vergoeden (deels) coaching. Check je polis of neem contact op.
                </p>
              </div>

              <div>
                <h4 style={{ color: '#3D5A80', marginBottom: '0.5rem' }}>Hoeveel sessies heb ik nodig?</h4>
                <p style={{ color: '#5B7FA3', fontSize: '0.95rem' }}>
                  Dit varieert per situatie. Gemiddeld werken mensen 4-8 sessies samen, maar ook een eenmalig gesprek kan waardevol zijn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', backgroundColor: '#2E4A6F', color: '#B8C9DB', textAlign: 'center' }}>
        <p>© 2025 Dynamic Parenting | <Link href="/login" style={{ color: '#7A9BBF' }}>Cliënt login</Link></p>
      </footer>
    </div>
  )
}
