import "./AboutUs.css";

function AboutUs() {
  const team = [
    {
      name: "Padma Pandurang Kamat",
      role: "Proprietor, Founder & Director",
      gender: "female",
      image: "/assets/Padma Pandurang Kamat.png",
    },
    {
      name: "Pandurang Timmappa Kamat",
      role: "Proprietor, Founder & Director",
      gender: "male",
      image: "/assets/Pandurang Timmappa Kamat.png",
    },
    {
      name: "Rekha Kamat",
      role: "Production Manager",
      gender: "female",
      image: "/assets/Rekha Kamat.png",
    },
    {
      name: "Ravi Kamat",
      role: "Sales Executive, B2B Sales & Orders",
      gender: "male",
      image: "/assets/Ravi Kamat.png",
    },
    {
      name: "Sunidhi Kamat",
      role: "Store Manager",
      gender: "female",
      image: "/assets/Sunidhi Kamat.png",
    },
    {
      name: "Harish Kamat",
      role: "Logistics",
      gender: "male",
      image: "/assets/Harish Kamat.png",
    },
  ];

  const values = [
    {
      icon: "🏆",
      title: "Quality First",
      description: "Consistent product quality",
    },
    {
      icon: "🤝",
      title: "Reliability",
      description: "On-time delivery promise",
    },
    {
      icon: "💰",
      title: "Fair Pricing",
      description: "Transparent B2B rates",
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description: "Eco-friendly production",
    },
    {
      icon: "👥",
      title: "People First",
      description: "Fair wages, safe workplace",
    },
  ];

  const highlights = [
    { value: "13+", label: "Years in Business" },
    { value: "12,000+", label: "Blocks / Month" },
    { value: "4", label: "Product Variants" },
    { value: "5", label: "Skilled Labour" },
    { value: "KA", label: "States Served" },
    { value: "3,15,111", label: "Monthly Revenue" },
  ];

  const products = ['4"', '6"', '8"', '12"'];

  const standards = [
    {
      title: "Compressive Strength",
      detail: "3.5–7.5 N/mm²",
    },
    {
      title: "Water Absorption",
      detail: "< 10% by weight",
    },
    {
      title: "Production Capacity",
      detail: "1,500 units/day",
    },
    {
      title: "Quality Testing",
      detail: "In-house",
    },
  ];

  const contactDetails = [
    {
      title: "Business Address",
      lines: [
        "Shree Kundodari Cement Products",
        "Halkar Road, Kumta",
        "Uttara Kannada — 581343",
        "Karnataka, India",
      ],
    },
    {
      title: "Contact",
      lines: [
        "Phone: +91 94485 37722",
        "Email: harish.kamat01@gmail.com",
        "WhatsApp: +91 94485 37722",
      ],
    },
    {
      title: "Business Hours",
      lines: ["Monday—Saturday", "9 AM—5 PM"],
    },
    {
      title: "Service Area",
      lines: ["Karnataka"],
    },
  ];

  return (
    <div className="page skcp-about-us">
      {/* Company Header */}
      <header className="about-header">
        <div className="about-header-logo">
          <img
            src="/assets/skcp-logo.png"
            alt="Shree Kundodari Cement Products logo"
          />
        </div>

        <div className="about-header-copy">
          <p className="about-eyebrow">
            SHREE KUNDODARI CEMENT PRODUCTS
          </p>

          <h1>About Us</h1>

          <p className="about-tagline">
            Build your dreams with our passion
          </p>

          <p className="about-intro">
            A trusted cement products manufacturer serving customers
            across Karnataka with a focus on quality, reliability,
            fair pricing, and dependable service.
          </p>
        </div>
      </header>

      {/* Business Highlights */}
      <section className="about-section about-highlights">
        <div className="about-section-heading">
          <span className="about-section-kicker">
            OUR BUSINESS
          </span>
          <h2>SKCP at a Glance</h2>
          <p>Key highlights of our business.</p>
        </div>

        <div className="about-highlight-grid">
          {highlights.map((item) => (
            <div className="about-highlight-card" key={item.label}>
              <div className="about-highlight-value">
                {item.value}
              </div>
              <div className="about-highlight-label">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products and Standards */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-section-kicker">
            QUALITY & CRAFTSMANSHIP
          </span>
          <h2>Products &amp; Standards</h2>
          <p>Our products and quality commitments.</p>
        </div>

        <div className="about-product-grid">
          {products.map((size) => (
            <div className="about-product-card" key={size}>
              <div className="about-product-icon" aria-hidden="true">
                🧱
              </div>
              <div className="about-product-size">{size}</div>
              <div className="about-product-name">
                Solid Concrete Blocks
              </div>
            </div>
          ))}
        </div>

        <div className="about-detail-grid">
          {standards.map((item) => (
            <div className="about-detail-card" key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-section-kicker">
            THE PEOPLE BEHIND SKCP
          </span>
          <h2>Our Team</h2>
          <p>The people who contribute to our daily operations.</p>
        </div>

        <div className="about-team-grid">
          {team.map((member) => (
            <article className="about-team-card" key={member.name}>
              <div className="about-team-photo">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span className="about-team-fallback" aria-hidden="true">
                  {member.gender === "female" ? "F" : "M"}
                </span>
              </div>

              <div className="about-team-name">{member.name}</div>
              <div className="about-team-role">{member.role}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Vision and Mission */}
      <div className="about-purpose-grid">
        <section className="about-section about-purpose-card">
          <div className="about-purpose-icon" aria-hidden="true">
            🎯
          </div>
          <div className="about-section-heading">
            <span className="about-section-kicker">
              OUR DIRECTION
            </span>
            <h2>Our Vision</h2>
          </div>
          <p>
            To be the most trusted and preferred cement block
            manufacturer known for quality, reliability, and
            customer satisfaction.
          </p>
        </section>

        <section className="about-section about-purpose-card">
          <div className="about-purpose-icon" aria-hidden="true">
            🚀
          </div>
          <div className="about-section-heading">
            <span className="about-section-kicker">
              OUR COMMITMENT
            </span>
            <h2>Our Mission</h2>
          </div>
          <p>
            Deliver superior quality cement products on time,
            every time — with transparent pricing, ethical business
            practices, and unwavering commitment to standards.
          </p>
        </section>
      </div>

      {/* Our Values */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-section-kicker">
            WHAT GUIDES US
          </span>
          <h2>Our Values</h2>
          <p>The principles behind our work and relationships.</p>
        </div>

        <div className="about-values-grid">
          {values.map((value) => (
            <article className="about-value-card" key={value.title}>
              <div className="about-value-icon" aria-hidden="true">
                {value.icon}
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Location and Contact */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-section-kicker">
            GET IN TOUCH
          </span>
          <h2>Location &amp; Contact</h2>
          <p>Find our business and contact us.</p>
        </div>

        <div className="about-contact-grid">
          {contactDetails.map((item) => (
            <div className="about-contact-card" key={item.title}>
              <h3>{item.title}</h3>
              <div className="about-contact-lines">
                {item.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <span>SKCP · Shree Kundodari Cement Products</span>
        <span>Quality first. Every block matters.</span>
      </footer>
    </div>
  );
}

export default AboutUs;
