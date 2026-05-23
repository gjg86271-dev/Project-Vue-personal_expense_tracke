<script setup>
import { computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'

// ✅ Read from store directly — no props needed
const trstore = useTransactionStore()

const todayKey = new Date().toLocaleDateString('km-KH', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

// ✅ Filter today's transactions from the store
const todayTransactions = computed(() => {
  const today = new Date()
  return (trstore.transactions ?? []).filter(item => {
    const d = new Date(item.transactionDate)
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth()    === today.getMonth()    &&
      d.getDate()     === today.getDate()
    )
  })
})

const groupedItems = computed(() => {
  return [...todayTransactions.value]
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .reduce((groups, item) => {
      const dateKey = new Date(item.transactionDate).toLocaleDateString('km-KH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
      ;(groups[dateKey] ??= []).push(item)
      return groups
    }, {})
})

// ✅ Fetch today's data on mount — page 1, no extra filters needed
onMounted(() => {
  trstore.fetchTransactions(1)
})
</script>

<template>
  <!-- LOADING SKELETON -->
  <template v-if="trstore.loading">
    <div v-for="n in 3" :key="n" class="skeleton-card"></div>
  </template>

  <template v-else>
    <div v-if="todayTransactions.length > 0">
      <div v-for="(group, date) in groupedItems" :key="date" class="mb-4">

        <!-- Date Header -->
        <div class="date-header-wrap">
          <h6 :class="['date-header', date === todayKey ? 'date-header--today' : '']">
            {{ date }}
          </h6>
          <span v-if="date === todayKey" class="today-badge">ថ្ងៃនេះ</span>
        </div>

        <!-- DESKTOP TABLE -->
        <div :class="['table-wrap d-none d-md-block', date === todayKey ? 'table-wrap--today' : '']">
          <table class="table mb-0">
            <thead class="table-secondary">
              <tr class="text-center">
                <th>កំណត់ចំណាំ</th>
                <th>ប្រភេទ</th>
                <th>ចំណូល/ចំណាយ</th>
                <th>ចំនួនទឹកប្រាក់</th>
                <th>ឯកសារ</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-center" v-for="item in group" :key="item.id">
                <td>{{ item.notes || '—' }}</td>
                <td>{{ item.category?.name }}</td>
                <td>
                  <span :class="item.category?.type === 'INCOME'
                    ? 'badge bg-success-subtle text-success'
                    : 'badge bg-danger-subtle text-danger'">
                    {{ item.category?.type === 'INCOME' ? 'ចំណូល' : 'ចំណាយ' }}
                  </span>
                </td>
                <td :class="item.category?.type === 'INCOME'
                  ? 'text-success fw-semibold'
                  : 'text-danger fw-semibold'">
                  {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ Number(item.amount).toLocaleString() }}
                </td>
                <td>
                  <a v-if="item.attachmentUrl" :href="item.attachmentUrl" target="_blank" class="attachment-link">
                    <i class="bi bi-paperclip"></i>
                  </a>
                  <span v-else class="text-muted">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOBILE CARDS -->
        <div class="d-md-none">
          <div v-for="item in group" :key="item.id"
            :class="['mobile-card', date === todayKey ? 'mobile-card--today' : '']">

            <div class="mobile-card__left">
              <div :class="['mobile-icon', item.category?.type === 'INCOME' ? 'icon--income' : 'icon--expense']">
                <i :class="item.category?.type === 'INCOME' ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
              </div>
              <div>
                <div class="mobile-card__category">{{ item.category?.name }}</div>
                <div class="mobile-card__note">{{ item.notes || '—' }}</div>
                <a v-if="item.attachmentUrl" :href="item.attachmentUrl" target="_blank" class="attachment-link small">
                  <i class="bi bi-paperclip"></i> ឯកសារ
                </a>
              </div>
            </div>

            <div class="mobile-card__right">
              <div :class="item.category?.type === 'INCOME' ? 'amount--income' : 'amount--expense'">
                {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ Number(item.amount).toLocaleString() }}
              </div>
              <div class="mobile-card__time">
                {{ new Date(item.transactionDate).toLocaleTimeString('en-GB', {
                  hour: '2-digit', minute: '2-digit'
                }) }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="empty-state">
      <i class="bi bi-inbox fs-1 d-block mb-2"></i>
      គ្មានប្រតិបត្តិការថ្ងៃនេះ
    </div>
  </template>
</template>

<style scoped>
/* SKELETON */
.skeleton-card {
  height: 64px;
  border-radius: var(--radius);
  background: linear-gradient(
    90deg,
    var(--bg-input) 25%,
    var(--border-color) 50%,
    var(--bg-input) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  margin-bottom: 8px;
}
@keyframes shimmer {
  0%   { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
/* DESKTOP TABLE */
.table-wrap {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  background-color: var(--bg-card);
}
.table-wrap--today { box-shadow: 0 0 0 2px var(--primary); }

.table {
  border-collapse: collapse;
  font-family: var(--font-khmer);
  width: 100%;
  background-color: var(--bg-card);  /* ✅ */
}

/* ✅ Override Bootstrap thead */
.table :deep(thead.table-secondary) {
  background-color: var(--bg-input) !important;
  color: var(--text-primary);
}
.table :deep(thead.table-secondary th) {
  background-color: var(--bg-input) !important;
  color: var(--text-primary);
  border-color: var(--border-color);
}

/* ✅ Override Bootstrap tbody rows */
.table :deep(tbody tr) {
  background-color: var(--bg-card) !important;
  color: var(--text-primary);
}
.table :deep(tbody td) {
  background-color: var(--bg-card) !important;
  color: var(--text-primary);
  border-color: var(--border-color);
}

/* DATE HEADER */
.date-header-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-left: 4px;
}
.date-header {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0;
  font-family: var(--font-khmer);
}
.date-header--today { color: var(--text-secondary); }
.today-badge {
  display: inline-block;
  background: var(--color-success);
  color: var(--text-white);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  font-family: var(--font-khmer);
}

/* DESKTOP TABLE */
.table-wrap {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}
.table-wrap--today { box-shadow: var(--shadow); }
.table { border-collapse: collapse; font-family: var(--font-khmer); }

/* MOBILE CARD */
.mobile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-card);
  border-radius: var(--radius);
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: var(--shadow);
  font-family: var(--font-khmer);
  border: 1.5px solid var(--border-color);
  transition: border-color var(--transition);
}
.mobile-card--today { border-color: var(var(--shadow)); }
.mobile-card__left  { display: flex; align-items: center; gap: 12px; }
.mobile-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: grid; place-items: center; font-size: 16px; flex-shrink: 0;
}
.icon--income  { background-color: var(--color-success-light); color: var(--color-success); }
.icon--expense { background-color: var(--color-danger-light);  color: var(--color-danger);  }
.mobile-card__category { font-size: 14px; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
.mobile-card__note {
  font-size: 12px; color: var(--text-secondary); line-height: 1.3;
  max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.mobile-card__right { text-align: right; flex-shrink: 0; }
.amount--income  { font-size: 15px; font-weight: 700; color: var(--color-success); }
.amount--expense { font-size: 15px; font-weight: 700; color: var(--color-danger);  }
.mobile-card__time { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }

/* ATTACHMENT */
.attachment-link {
  font-size: 13px; color: var(--color-primary);
  text-decoration: none; display: inline-flex; align-items: center; gap: 3px; margin-top: 2px;
}
.attachment-link:hover { text-decoration: underline; }

/* EMPTY */
.empty-state {
  text-align: center; padding: 48px 0;
  color: var(--text-secondary);
  font-family: var(--font-khmer);
}
</style>