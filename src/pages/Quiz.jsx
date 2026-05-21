import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../services/productService.js'
import { getNumericPrice } from '../utils/formatPrice.js'

const budgetOptions = [
  `Under \u20A65,000`,
  `\u20A65,000 - \u20A610,000`,
  `\u20A610,000 - \u20A620,000`,
  `Above \u20A620,000`,
]

const quizQuestions = [
  {
    id: 'gender',
    label: 'Who are you shopping for?',
    options: ['Male', 'Female', 'Unisex'],
  },
  {
    id: 'scentType',
    label: 'What scent vibe do you prefer?',
    options: ['Sweet', 'Fresh', 'Floral', 'Woody', 'Spicy', 'Oud', 'Citrus', 'Vanilla'],
  },
  {
    id: 'occasion',
    label: 'What occasion is it for?',
    options: ['Everyday', 'Office', 'Date Night', 'Gift', 'Luxury', 'Evening'],
  },
  {
    id: 'longevity',
    label: 'What longevity do you prefer?',
    options: ['Mild', 'Moderate', 'Long-lasting'],
  },
  {
    id: 'budget',
    label: 'What is your budget?',
    options: budgetOptions,
  },
]

function matchesBudget(price, budget) {
  const numericPrice = getNumericPrice(price)

  if (budget === budgetOptions[0]) {
    return numericPrice > 0 && numericPrice < 5000
  }

  if (budget === budgetOptions[1]) {
    return numericPrice >= 5000 && numericPrice <= 10000
  }

  if (budget === budgetOptions[2]) {
    return numericPrice >= 10000 && numericPrice <= 20000
  }

  if (budget === budgetOptions[3]) {
    return numericPrice > 20000
  }

  return false
}

function scoreProduct(product, answers) {
  let score = 0

  if (product.gender === answers.gender || product.gender === 'Unisex') {
    score += 2
  }

  if (product.scentType === answers.scentType) {
    score += 3
  }

  if (product.occasion === answers.occasion) {
    score += 2
  }

  if (product.longevity === answers.longevity) {
    score += 1
  }

  if (matchesBudget(product.price, answers.budget)) {
    score += 2
  }

  if (product.topPick) {
    score += 1
  }

  if (product.inStock) {
    score += 1
  }

  return score
}

export default function Quiz() {
  const [answers, setAnswers] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      setLoading(true)
      setError('')

      try {
        const productList = await getProducts()

        if (isMounted) {
          setProducts(productList)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load quiz recommendations.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const currentQuestion = quizQuestions[currentStep]
  const selectedAnswer = answers[currentQuestion.id]
  const isLastStep = currentStep === quizQuestions.length - 1

  const recommendations = useMemo(() => {
    const scoredProducts = products
      .map((product) => ({
        ...product,
        matchScore: scoreProduct(product, answers),
      }))
      .sort((first, second) => second.matchScore - first.matchScore)

    const strongMatches = scoredProducts.filter((product) => product.matchScore >= 4)

    if (strongMatches.length > 0) {
      return strongMatches.slice(0, 3)
    }

    return products
      .filter((product) => product.topPick || product.inStock)
      .sort((first, second) => {
        if (first.topPick !== second.topPick) {
          return first.topPick ? -1 : 1
        }

        return first.inStock === second.inStock ? 0 : first.inStock ? -1 : 1
      })
      .slice(0, 3)
  }, [answers, products])

  function handleSelect(questionId, option) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: option,
    }))
  }

  function handleNext() {
    if (!selectedAnswer) {
      return
    }

    if (isLastStep) {
      setIsComplete(true)
      return
    }

    setCurrentStep((step) => step + 1)
  }

  function handleRetake() {
    setAnswers({})
    setCurrentStep(0)
    setIsComplete(false)
  }

  return (
    <section className="page-section page-fill quiz-page">
      <div className="section-heading quiz-heading">
        <span className="eyebrow">Scent Quiz</span>
        <h1>Find your DSCENT.NG match</h1>
        <p>Answer five quick questions and discover fragrances that fit your mood, moment, and budget.</p>
      </div>

      {loading && (
        <div className="quiz-shell">
          <p className="muted">Preparing your scent quiz...</p>
        </div>
      )}

      {error && (
        <div className="empty-state">
          <h2>Quiz unavailable</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && !isComplete && (
        <div className="quiz-shell">
          <div className="quiz-progress-row">
            <span>
              Step {currentStep + 1} of {quizQuestions.length}
            </span>
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="quiz-card quiz-question-card">
            <Sparkles size={26} />
            <h2>{currentQuestion.label}</h2>
            <div className="quiz-options">
              {currentQuestion.options.map((option) => (
                <button
                  className={selectedAnswer === option ? 'selected' : ''}
                  key={option}
                  type="button"
                  onClick={() => handleSelect(currentQuestion.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-actions">
            <button
              className="button secondary"
              disabled={currentStep === 0}
              type="button"
              onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
            >
              <ArrowLeft size={17} />
              Back
            </button>
            <button className="button primary" disabled={!selectedAnswer} type="button" onClick={handleNext}>
              {isLastStep ? 'Show My Matches' : 'Next'}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}

      {!loading && !error && isComplete && (
        <div className="quiz-results">
          <div className="quiz-results-heading">
            <div>
              <span className="eyebrow">Personal Picks</span>
              <h2>Your scent matches</h2>
              <p>
                These recommendations are based on your fragrance profile. Add favourites to cart or order
                directly on WhatsApp.
              </p>
            </div>
            <button className="button secondary" type="button" onClick={handleRetake}>
              <RotateCcw size={17} />
              Retake Quiz
            </button>
          </div>

          {recommendations.length > 0 ? (
            <div className="product-grid quiz-product-grid">
              {recommendations.map((product) => (
                <ProductCard key={product.id} {...product} showWhatsappOrder viewLabel="View Details" />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No matches yet</h2>
              <p>Add products in the admin dashboard and your quiz recommendations will appear here.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
