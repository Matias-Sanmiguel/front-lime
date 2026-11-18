import { expect, test } from 'vitest'
import reducer, {
  fetchInquiries,
  initialState,
  markInquiryRead,
} from '../src/store/inquiriesSlice'
import { authLogout } from '../src/auth/actions'

test('markInquiryRead updates the cached inquiry and decrements unreadCount only once', () => {
  const inbox = {
    content: [{ id: 8, name: 'Sofía', readAt: null }],
    page: 1,
    totalPages: 3,
    unreadCount: 2,
  }
  let state = reducer(
    initialState,
    fetchInquiries.fulfilled(inbox, 'fetch-inbox', { page: 1 }),
  )

  state = reducer(
    state,
    markInquiryRead.fulfilled({ id: 8, readAt: '2026-11-18T12:00:00Z' }, 'mark-read', 8),
  )
  expect(state.items[0].readAt).toBe('2026-11-18T12:00:00Z')
  expect(state.unreadCount).toBe(1)

  state = reducer(
    state,
    markInquiryRead.fulfilled({ id: 8, readAt: '2026-11-18T12:00:00Z' }, 'mark-again', 8),
  )
  expect(state.unreadCount).toBe(1)
})

test('unread-count fetch preserves the inbox, and auth logout resets the slice', () => {
  const inbox = {
    content: [{ id: 3, readAt: null }],
    page: 2,
    totalPages: 4,
    unreadCount: 5,
  }
  let state = reducer(
    initialState,
    fetchInquiries.fulfilled(inbox, 'fetch-inbox', { page: 2 }),
  )

  state = reducer(
    state,
    fetchInquiries.fulfilled(
      { content: [], page: 0, totalPages: 0, unreadCount: 4 },
      'fetch-count',
      { unreadOnly: true, size: 1 },
    ),
  )
  expect(state.items).toEqual(inbox.content)
  expect(state.page).toBe(2)
  expect(state.totalPages).toBe(4)
  expect(state.unreadCount).toBe(4)

  expect(reducer(state, authLogout())).toEqual(initialState)
})
