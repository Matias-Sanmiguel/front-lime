import { useEffect, useState } from 'react'
import { ApiError } from '@/api/client'
import { getProperty, getPropertyImages } from '@/api/properties.js'

export interface PropertyImage {
  id: number
  url: string
}
interface Property {
  id: number
  title: string
  description: string
  type: string
  operation: string
  price: number
  currency: string
  address: string
  city: string
  province: string
  bedrooms: number | null
  bathrooms: number | null
  coveredArea: number | null
  totalArea: number | null
}

export function usePropertyDetail(id: string | undefined) {
  const [attempt, setAttempt] = useState(0)
  const [imageAttempt, setImageAttempt] = useState(0)
  const requestKey = `${id}:${attempt}`
  const imageKey = `${id}:${imageAttempt}`
  const [detail, setDetail] = useState<{
    key: string
    property: Property | null
    error: string | null
  } | null>(null)
  const [gallery, setGallery] = useState<{
    key: string
    images: PropertyImage[]
    error: boolean
  } | null>(null)
  useEffect(() => {
    if (!id) return
    let cancelled = false
    getProperty(id)
      .then((property: Property) => {
        if (!cancelled) setDetail({ key: requestKey, property, error: null })
      })
      .catch((error: unknown) => {
        if (!cancelled)
          setDetail({
            key: requestKey,
            property: null,
            error: error instanceof ApiError && error.status === 404 ? '404' : 'error',
          })
      })
    return () => {
      cancelled = true
    }
  }, [id, requestKey])
  useEffect(() => {
    if (!id) return
    let cancelled = false
    getPropertyImages(id)
      .then((images: PropertyImage[]) => {
        if (!cancelled) setGallery({ key: imageKey, images, error: false })
      })
      .catch(() => {
        if (!cancelled) setGallery({ key: imageKey, images: [], error: true })
      })
    return () => {
      cancelled = true
    }
  }, [id, imageKey])
  return {
    property: detail?.key === requestKey ? detail.property : null,
    loading: Boolean(id) && detail?.key !== requestKey,
    error: !id ? '404' : detail?.key === requestKey ? detail.error : null,
    images: gallery?.key === imageKey ? gallery.images : [],
    imagesLoading: gallery?.key !== imageKey,
    imagesError: gallery?.key === imageKey && gallery.error,
    retry: () => setAttempt((value) => value + 1),
    retryImages: () => setImageAttempt((value) => value + 1),
  }
}
