import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase.js'

const productsCollection = collection(db, 'products')
const productFields = [
  'name',
  'price',
  'oldPrice',
  'category',
  'scentType',
  'gender',
  'size',
  'longevity',
  'occasion',
  'description',
  'imageUrl',
  'images',
  'topPick',
  'inStock',
  'rating',
  'reviewCount',
]

function withId(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

function normalizeProductData(productData) {
  const normalized = productFields.reduce((normalized, field) => {
    if (field in productData) {
      normalized[field] = productData[field]
    }

    return normalized
  }, {})

  if ('rating' in normalized) {
    normalized.rating = Math.max(0, Math.min(5, Number(normalized.rating) || 0))
  }

  if ('reviewCount' in normalized) {
    normalized.reviewCount = Number(normalized.reviewCount) || 0
  }

  if ('images' in normalized) {
    normalized.images = Array.isArray(normalized.images) ? normalized.images : [normalized.images].filter(Boolean)
  }

  return normalized
}

export async function getProducts() {
  const productsQuery = query(productsCollection, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(productsQuery)

  return snapshot.docs.map(withId)
}

export async function getProductById(id) {
  const productRef = doc(db, 'products', id)
  const snapshot = await getDoc(productRef)

  if (!snapshot.exists()) {
    return null
  }

  return withId(snapshot)
}

export async function createProduct(productData) {
  const normalizedProduct = normalizeProductData(productData)

  return addDoc(productsCollection, {
    ...normalizedProduct,
    rating: normalizedProduct.rating ?? 5,
    reviewCount: Number(normalizedProduct.reviewCount) || 0,
    views: 0,
    whatsappClicks: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProduct(id, productData) {
  const productRef = doc(db, 'products', id)
  const normalizedProduct = normalizeProductData(productData)

  return updateDoc(productRef, {
    ...normalizedProduct,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id) {
  const productRef = doc(db, 'products', id)

  return deleteDoc(productRef)
}
