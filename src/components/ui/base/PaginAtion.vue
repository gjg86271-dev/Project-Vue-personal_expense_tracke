<template>
  <nav>
    <ul class="pagination">

      <!-- Prev -->
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <a class="page-link" href="#" @click.prevent="go(currentPage - 1)">«</a>
      </li>

      <!-- Pages -->
      <li
        v-for="(p, i) in pages"
        :key="i"
        class="page-item"
        :class="{ active: p === currentPage, disabled: p === '...' }"
      >
        <span v-if="p === '...'" class="page-link">…</span>
        <a v-else class="page-link" href="#" @click.prevent="go(p)">{{ p }}</a>
      </li>

      <!-- Next -->
      <li class="page-item" :class="{ disabled: currentPage >= totalPages }">
        <a class="page-link" href="#" @click.prevent="go(currentPage + 1)">»</a>
      </li>

    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage:  { type: Number, required: true },
  totalPages:   { type: Number, required: true },
  siblingCount: { type: Number, default: 1 },
})

const emit = defineEmits(['update:currentPage', 'change'])

const pages = computed(() => {
  const total   = props.totalPages
  const current = props.currentPage
  const s       = props.siblingCount

  // Show all pages when total is small
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const left  = Math.max(current - s, 2)          // never go below page 2 (page 1 always shown)
  const right = Math.min(current + s, total - 1)  // never go above total-1 (last always shown)

  const result = [1]  // always show first page

  if (left > 2)  result.push('...')

  for (let i = left; i <= right; i++) result.push(i)

  if (right < total - 1) result.push('...')

  result.push(total)  // always show last page

  return result
})

function go(page) {
  if (
    page < 1 ||
    page > props.totalPages ||
    page === props.currentPage ||
    typeof page !== 'number'
  ) return
  emit('update:currentPage', page)
  emit('change', page)
}
</script>