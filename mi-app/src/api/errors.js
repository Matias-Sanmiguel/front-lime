export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || `Error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}
