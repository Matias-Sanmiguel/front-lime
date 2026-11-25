// Las mismas reglas que FileStorageService en el backend. El backend sigue siendo la
// autoridad (el atributo `accept` del input es solo una pista y se puede saltear):
// esto únicamente evita mandar un request que ya sabemos que va a terminar en 400.
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

// Devuelve el motivo por el que el archivo no sirve, o null si se puede subir.
export function imageFileProblem(file) {
  if (file.size === 0) return 'el archivo está vacío.'
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'usá una foto JPG, PNG o WEBP.'
  if (file.size > MAX_IMAGE_BYTES) return 'supera el tamaño máximo de 5 MB.'
  return null
}
