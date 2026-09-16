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

  return (
    <div>
      {/* Company Hero */}
      <div className="about-hero">
        <div className="about-logo-big">
          <img
            src="/assets/skcp-logo.png"
            alt="Shree Kundodari Cement Products"
          />
        </div>

        <div>
          <div className="card-title">
            Shree Kundodari Cement Products
          </div>

          <div className="about-tagline">
            Build your dreams with our passion
          </div>

          <p
            style={{
              marginTop: "12px",
              maxWidth: "720px",
              lineHeight: "1.6",
            }}
          >
            A trusted cement products manufacturer serving customers across
            Karnataka with a focus on quality, reliability, fair pricing, and
            dependable service.
          </p>
        </div>
      </div>

      {/* Business Highlights */}
      <div className="about-stat-grid">
        <div className="about-stat">
          <div className="about-stat-val">13+</div>
          <div className="about-stat-lbl">Years in Business</div>
        </div>

        <div className="about-stat">
          <div className="about-stat-val">12,000+</div>
          <div className="about-stat-lbl">Blocks / Month</div>
        </div>

        <div className="about-stat">
          <div className="about-stat-val">3</div>
          <div className="about-stat-lbl">Product Variants</div>
        </div>

        <div className="about-stat">
          <div className="about-stat-val">5</div>
          <div className="about-stat-lbl">Skilled Labour</div>
        </div>

        <div className="about-stat">
          <div className="about-stat-val">KA</div>
          <div className="about-stat-lbl">States Served</div>
        </div>

        <div className="about-stat">
          <div className="about-stat-val">3,15,111</div>
          <div className="about-stat-lbl">Monthly Revenue</div>
        </div>
      </div>

      {/* Products & Standards */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">
            Products &amp; Standards
          </div>
        </div>

        <div className="card-body">
          <div className="oo-stat-grid">
            {/* 4" Solid Concrete Block */}
            <div className="oo-card">
              <div className="team-av">
                4"
              </div>

              <div>
                <strong>
                  Solid Concrete Blocks
                </strong>

                <div className="team-role">
                  4"
                </div>
              </div>
            </div>

            {/* 6" Solid Concrete Block */}
            <div className="oo-card">
              <div className="team-av">
                6"
              </div>

              <div>
                <strong>
                  Solid Concrete Blocks
                </strong>

                <div className="team-role">
                  6"
                </div>
              </div>
            </div>

            {/* 8" Solid Concrete Block */}
            <div className="oo-card">
              <div className="team-av">
                8"
              </div>

              <div>
                <strong>
                  Solid Concrete Blocks
                </strong>

                <div className="team-role">
                  8"
                </div>
              </div>
            </div>
          </div>

          <div
            className="skcp-detail-grid"
            style={{ marginTop: "14px" }}
          >
            <div>
              <strong>
                Compressive Strength
              </strong>

              <div className="team-role">
                3.5–7.5 N/mm²
              </div>
            </div>

            <div>
              <strong>
                Water Absorption
              </strong>

              <div className="team-role">
                &lt; 10% by weight
              </div>
            </div>

            <div>
              <strong>
                Production Capacity
              </strong>

              <div className="team-role">
                1,500 units/day
              </div>
            </div>

            <div>
              <strong>
                Quality Testing
              </strong>

              <div className="team-role">
                In-house
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">
            Our Team
          </div>
        </div>

        <div className="card-body">
          <div className="about-team">
            {team.map((member) => (
              <div
                className="team-card"
                key={member.name}
              >
                <div
                  className="team-av"
                  aria-label={
                    member.image
                      ? `${member.name} photo`
                      : `${member.gender} avatar`
                  }
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                    />
                  ) : (
                    member.gender === "female" ? "F" : "M"
                  )}
                </div>

                <div className="team-name">
                  {member.name}
                </div>

                <div className="team-role">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="oo-stat-grid">
        <div
          className="card"
          style={{ marginBottom: 0 }}
        >
          <div className="card-head">
            <div className="card-title">
              Our Vision
            </div>
          </div>

          <div className="card-body">
            To be the most trusted and preferred cement block manufacturer
            known for quality, reliability, and customer satisfaction.
          </div>
        </div>

        <div
          className="card"
          style={{ marginBottom: 0 }}
        >
          <div className="card-head">
            <div className="card-title">
              Our Mission
            </div>
          </div>

          <div className="card-body">
            Deliver superior quality cement products on time, every time
            &mdash; with transparent pricing, ethical business practices, and
            unwavering commitment to standards.
          </div>
        </div>
      </div>

      {/* Values */}
      <div
        className="card"
        style={{ marginTop: "14px" }}
      >
        <div className="card-head">
          <div className="card-title">
            Our Values
          </div>
        </div>

        <div className="card-body">
          <div className="about-team">
            {values.map((value) => (
              <div
                className="team-card"
                key={value.title}
              >
                <div
                  className="team-av"
                  role="img"
                  aria-label={value.title}
                >
                  {value.icon}
                </div>

                <div className="team-name">
                  {value.title}
                </div>

                <div className="team-role">
                  {value.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">
            Location &amp; Contact
          </div>
        </div>

        <div className="card-body">
          <div className="skcp-detail-grid">
            <div>
              <strong>
                Business Address
              </strong>

              <div className="team-role">
                Shree Kundodari Cement Products
                <br />
                Halkar Road, Kumta
                <br />
                Uttara Kannada &mdash; 581343
                <br />
                Karnataka, India
              </div>
            </div>

            <div>
              <strong>
                Contact
              </strong>

              <div className="team-role">
                Phone: +91 94485 37722
                <br />
                Email: harish.kamat01@gmail.com
                <br />
                WhatsApp: +91 94485 37722
              </div>
            </div>

            <div>
              <strong>
                Business Hours
              </strong>

              <div className="team-role">
                Monday&mdash;Saturday
                <br />
                9 AM&mdash;5 PM
              </div>
            </div>

            <div>
              <strong>
                Service Area
              </strong>

              <div className="team-role">
                Karnataka
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;