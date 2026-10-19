export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-content">
        <span className="micro-label" style={{ marginBottom: '2rem' }}>The Craft</span>
        <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Architectural Integrity</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '4rem', maxWidth: 400 }}>
          Every pair of Amarni footwear is constructed with an uncompromising dedication to form and
          function. We treat leather like stone and thread like steel, engineering silhouettes that
          stand outside of time.
        </p>
        <div>
          <div className="telemetry-row">
            <span className="micro-label">Stitching Density</span>
            <span className="telemetry-val">14 SPI</span>
          </div>
          <div className="telemetry-row">
            <span className="micro-label">Tanning Process</span>
            <span className="telemetry-val">Vegetal 40d</span>
          </div>
          <div className="telemetry-row">
            <span className="micro-label">Last Origin</span>
            <span className="telemetry-val">Milan, IT</span>
          </div>
        </div>
      </div>
      <div className="about-image">
        <img
          src="https://images.pexels.com/photos/293404/pexels-photo-293404.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Amarni craftsmanship detail"
          loading="lazy"
        />
      </div>
    </section>
  );
}
