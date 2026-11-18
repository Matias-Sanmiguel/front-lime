import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '@/api/client'
import { authLogout } from '@/auth/actions'

export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchInquiries',
  async ({ page, unreadOnly, propertyId, size } = {}) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries({ page, unreadOnly, propertyId, size })) {
      if (value !== undefined && value !== null) params.set(key, String(value))
    }
    const query = params.toString()
    return apiFetch(`/api/v1/me/inquiries${query ? `?${query}` : ''}`)
  },
)

export const fetchInquiry = createAsyncThunk('inquiries/fetchInquiry', async (id) =>
  apiFetch(`/api/v1/me/inquiries/${encodeURIComponent(id)}`),
)

export const markInquiryRead = createAsyncThunk('inquiries/markInquiryRead', async (id) =>
  apiFetch(`/api/v1/me/inquiries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { read: true },
  }),
)

export const initialState = {
  items: [],
  page: 0,
  totalPages: 0,
  unreadCount: 0,
  status: 'idle',
  error: null,
}

const isUnreadCountRequest = (arg) => arg?.unreadOnly === true && arg?.size === 1
const start = (state) => {
  state.status = 'loading'
  state.error = null
}
const fail = (state, action) => {
  state.status = 'failed'
  state.error = action.error.message ?? 'No pudimos completar la operación'
}

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state, action) => {
        if (!isUnreadCountRequest(action.meta.arg)) start(state)
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        const response = action.payload
        state.unreadCount = response.unreadCount ?? state.unreadCount
        if (!isUnreadCountRequest(action.meta.arg)) {
          state.items = response.content ?? []
          state.page = response.page ?? 0
          state.totalPages = response.totalPages ?? 0
          state.status = 'succeeded'
          state.error = null
        } else if (state.status !== 'loading') {
          state.status = 'succeeded'
          state.error = null
        }
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        if (!isUnreadCountRequest(action.meta.arg) || state.status !== 'loading')
          fail(state, action)
      })
      .addCase(fetchInquiry.pending, start)
      .addCase(fetchInquiry.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => String(item.id) === String(action.payload.id),
        )
        if (index === -1) state.items.push(action.payload)
        else state.items[index] = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchInquiry.rejected, fail)
      .addCase(markInquiryRead.pending, start)
      .addCase(markInquiryRead.fulfilled, (state, action) => {
        const id = action.meta.arg
        const item = state.items.find((inquiry) => String(inquiry.id) === String(id))
        const wasUnread = !item || !item.readAt
        if (item) {
          Object.assign(item, action.payload ?? {}, {
            read: true,
            readAt: action.payload?.readAt ?? item.readAt ?? new Date().toISOString(),
          })
        } else if (action.payload) {
          state.items.push({
            ...action.payload,
            id,
            read: true,
            readAt: action.payload.readAt ?? new Date().toISOString(),
          })
        }
        if (wasUnread) state.unreadCount = Math.max(0, state.unreadCount - 1)
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(markInquiryRead.rejected, fail)
      .addCase(authLogout, () => initialState)
  },
})

export const selectInquiries = (state) => state.inquiries.items
export const selectUnreadCount = (state) => state.inquiries.unreadCount
export const selectInquiriesPage = (state) => state.inquiries.page
export const selectInquiriesTotalPages = (state) => state.inquiries.totalPages
export const selectInquiriesStatus = (state) => state.inquiries.status
export const selectInquiriesError = (state) => state.inquiries.error

export default inquiriesSlice.reducer
