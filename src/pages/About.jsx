import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, MessageCircle, Sparkles, SprayCan, Star, Wallet } from 'lucide-react'

const offerCards = [
  'Perfume oils',
  'Designer-inspired fragrances',
  'Body sprays',
  'Gift sets',
  'Everyday and luxury scents',
]

const reasons = [
  {
    icon: Sparkles,
    title: 'Carefully selected scents',
    text: 'Every pick is chosen for people who want to smell polished, fresh, and memorable.',
  },
  {
    icon: MessageCircle,
    title: 'Easy WhatsApp ordering',
    text: 'Ask questions, confirm availability, and place your order without complicated checkout.',
  },
  {
    icon: Wallet,
    title: 'Affordable options',
    text: 'Find elegant fragrances across budgets, from everyday oils to premium scent moments.',
  },
  {
    icon: Star,
    title: 'Fresh, stylish experience',
    text: 'DSCENT.NG helps you match your scent to your mood, outfit, occasion, and confidence.',
  },
]

export default function About() {
  return (
    <section className="page-section page-fill about-page">
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <span className="hero-badge eyebrow">DSCENT.NG</span>
        <h1>About DSCENT.NG</h1>
        <h2>Smell Fresh. Look Better.</h2>
        <p>
          DSCENT.NG is a fragrance brand focused on helping customers discover scents that match
          their style, mood, and everyday confidence.
        </p>
      </motion.div>

      <div className="about-story">
        <span className="eyebrow">Our Story</span>
        <h2>Fragrance shopping made simple</h2>
        <p>
          DSCENT.NG started with a simple belief: finding a good fragrance should feel exciting, not
          stressful. We help customers discover affordable, elegant, and long-lasting scents that fit
          real life, from fresh everyday confidence to special moments that deserve something richer.
          Every recommendation is guided by style, mood, budget, and the kind of impression you want
          to leave.
        </p>
      </div>

      <div className="about-section">
        <div className="section-heading">
          <span className="eyebrow">What We Offer</span>
          <h2>Scents for every moment</h2>
        </div>
        <div className="about-card-grid offer-grid">
          {offerCards.map((offer) => (
            <article className="about-card" key={offer}>
              <SprayCan size={22} />
              <h3>{offer}</h3>
            </article>
          ))}
        </div>
      </div>

      <div className="about-section">
        <div className="section-heading">
          <span className="eyebrow">Why Shop With Us</span>
          <h2>A smoother fragrance experience</h2>
        </div>
        <div className="about-card-grid">
          {reasons.map((reason) => {
            const Icon = reason.icon

            return (
              <article className="about-card reason-card" key={reason.title}>
                <Icon size={23} />
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            )
          })}
        </div>
      </div>

      <div className="about-cta">
        <Gift size={28} />
        <div>
          <span className="eyebrow">Ready to choose yours?</span>
          <h2>Find your next signature scent</h2>
        </div>
        <div className="about-cta-actions">
          <Link className="button primary" to="/products">
            Shop Collection
          </Link>
          <Link className="button secondary" to="/quiz">
            Take Scent Quiz
          </Link>
        </div>
      </div>
    </section>
  )
}
