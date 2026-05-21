import { doc, increment, updateDoc } from 'firebase/firestore'
import { db } from './firebase.js'

export async function incrementWhatsappClick(productId) {
  const productRef = doc(db, 'products', productId)

  return updateDoc(productRef, {
    whatsappClicks: increment(1),
  })
}

export async function incrementProductView(productId) {
  const productRef = doc(db, 'products', productId)

  return updateDoc(productRef, {
    views: increment(1),
  })
}
