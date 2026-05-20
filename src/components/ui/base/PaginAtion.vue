<template>
  <nav aria-label="Pagination">
    <ul class="pagination" :class="sizeClass">

      <!-- Previous -->
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="goToPage(currentPage - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- Pages -->
      <li
        v-for="item in visiblePages"
        :key="item"
        class="page-item"
        :class="{
          active: item === currentPage,
          disabled: item === '...',
        }"
      >
        <span v-if="item === '...'" class="page-link">…</span>
        <a
          v-else
          class="page-link"
          href="#"
          :aria-current="item === currentPage ? 'page' : undefined"
          @click.prevent="goToPage(item)"
        >
          {{ item }}
        </a>
      </li>

      <!-- Next -->
      <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="goToPage(currentPage + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  /** Current active page (1-based) */
  currentPage: {
    type: Number,
    required: true,
  },
  /** Total number of pages */
  totalPages: {
    type: Number,
    required: true,
  },
  /**
   * Pages shown on each side of the current page before collapsing to ellipsis.
   * siblingCount=1 → [1, …, 4, 5↑, 6, …, 20]
   */
  siblingCount: {
    type: Number,
    default: 1,
  },
  /**
   * Bootstrap size variant: 'sm' | 'lg' | null (default / medium)
   */
  size: {
    type: String,
    default: null,
    validator: (v) => [null, 'sm', 'lg'].includes(v),
  },
})

// ─── Emits ────────────────────────────────────────────────────────────────────
const emit = defineEmits(['update:currentPage', 'change'])

// ─── Computed ─────────────────────────────────────────────────────────────────
const sizeClass = computed(() => {
  if (props.size === 'sm') return 'pagination-sm'
  if (props.size === 'lg') return 'pagination-lg'
  return null
})

/**
 * Builds the page list, inserting '...' where page gaps exist.
 * Always includes page 1, last page, and currentPage ± siblingCount.
 */
const visiblePages = computed(() => {
  const { totalPages: total, currentPage: current, siblingCount: siblings } = props

  // No ellipsis needed when total pages are few
  if (total <= 2 * siblings + 5) return range(1, total)

  const left  = Math.max(current - siblings, 1)
  const right = Math.min(current + siblings, total)

  const showLeftDots  = left > 2
  const showRightDots = right < total - 1

  if (!showLeftDots && showRightDots)  return [...range(1, right + 1), '...', total]
  if (showLeftDots  && !showRightDots) return [1, '...', ...range(left - 1, total)]

  // Both sides
  return [1, '...', ...range(left, right), '...', total]
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// ─── Methods ──────────────────────────────────────────────────────────────────
function goToPage(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('change', page)
}
</script>