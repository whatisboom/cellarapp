import { Link } from '@tanstack/react-router'
import { Button } from '@whatisboom/boom-ui'

interface PaginationProps {
  page: number
  totalPages: number
  to: string
  search?: Record<string, unknown>
}

export function Pagination({ page, totalPages, to, search = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center gap-2">
      <Link to={to} search={{ ...search, page: page - 1 }}>
        <Button variant="secondary" size="sm" disabled={page <= 1}>Previous</Button>
      </Link>
      <span className="flex items-center text-sm" style={{ color: 'var(--boom-theme-text-secondary)' }}>
        Page {page} of {totalPages}
      </span>
      <Link to={to} search={{ ...search, page: page + 1 }}>
        <Button variant="secondary" size="sm" disabled={page >= totalPages}>Next</Button>
      </Link>
    </div>
  )
}
