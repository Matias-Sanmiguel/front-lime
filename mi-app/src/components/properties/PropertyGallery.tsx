import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { imageUrl } from '@/api/properties.js'
import type { PropertyImage } from '@/hooks/usePropertyDetail'

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const selectedIndex = Math.min(currentIndex, images.length - 1)
  const move = (direction: number) =>
    setCurrentIndex((index) => (index + direction + images.length) % images.length)
  const controlClass =
    'flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-background'
  if (!images.length)
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-background text-muted-foreground sm:h-96">
        Este aviso todavía no tiene fotos.
      </div>
    )
  return (
    <div>
      <div className="relative overflow-hidden rounded-lg bg-background">
        <button
          ref={openerRef}
          type="button"
          aria-label="Ampliar foto"
          onClick={() => dialogRef.current?.showModal()}
          className="block w-full cursor-zoom-in"
        >
          <img
            src={imageUrl(images[selectedIndex])}
            alt={`${title}, foto ${selectedIndex + 1}`}
            className="h-64 w-full object-cover sm:h-96"
          />
          <span className="absolute right-3 top-3 rounded-md bg-surface p-2 text-foreground">
            <Expand className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm tabular-nums text-muted-foreground">
          Foto {selectedIndex + 1} de {images.length}
        </p>
        {images.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Foto anterior"
              className={controlClass}
              onClick={() => move(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              className={controlClass}
              onClick={() => move(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <dialog
        ref={dialogRef}
        aria-label={`Fotos de ${title}`}
        onClose={() => openerRef.current?.focus()}
        className="fixed inset-0 m-auto max-h-[95dvh] w-[min(96vw,72rem)] max-w-none rounded-lg border border-border bg-surface p-4 text-foreground backdrop:bg-foreground/80"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm tabular-nums" aria-live="polite">
            Foto {selectedIndex + 1} de {images.length}
          </p>
          <button
            type="button"
            aria-label="Cerrar fotos"
            className={controlClass}
            onClick={() => dialogRef.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <img
          src={imageUrl(images[selectedIndex])}
          alt={`${title}, foto ampliada ${selectedIndex + 1}`}
          className="h-[65dvh] w-full object-contain"
        />
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-3">
            <button
              type="button"
              aria-label="Foto ampliada anterior"
              className={controlClass}
              onClick={() => move(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Foto ampliada siguiente"
              className={controlClass}
              onClick={() => move(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </dialog>
    </div>
  )
}
