<script setup>
import { computed } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  }
})

const todayTransactions = computed(() => {
  const todayStr = new Date().toLocaleDateString('en-CA') 
  return [...props.transactions]
    .filter(item => {
      const itemStr = item.transactionDate?.slice(0, 10)
      return itemStr === todayStr
    })
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
})


</script>

<template>
  <div v-if="todayTransactions.length > 0">

    <!-- Date Header -->
    <div class="date-header-wrap">
      <h6 class="date-header date-header--today">
        {{ new Date().toLocaleDateString('km-KH', {
          weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
        }) }}
      </h6>
      <span class="today-badge">ថ្ងៃនេះ</span>
    </div>

    <!-- DESKTOP TABLE -->
    <div class="table-wrap d-none d-md-block table-wrap--today">
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
          <tr class="text-center" v-for="item in todayTransactions" :key="item.id">
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
              {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ item.amount?.toLocaleString() }}
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
      <div v-for="item in todayTransactions" :key="item.id" class="mobile-card mobile-card--today">

        <div class="mobile-card__left">
          <div :class="['mobile-icon', item.category?.type === 'INCOME' ? 'icon--income' : 'icon--expense']">
            <i :class="item.category?.type === 'INCOME' ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
          </div>
          <div>
            <div class="mobile-card__category">{{ item.category?.name }}</div>
            <div class="mobile-card__note">{{ item.notes || '—' }}</div>
            <a v-if="item.attachmentUrl" :href="item.attachmentUrl" target="_blank"
              class="attachment-link small" @click.stop>
              <i class="bi bi-paperclip"></i> ឯកសារ
            </a>
            <!-- បង្ហាញរូបភាព preview បើ attachmentUrl មាន -->
            <div v-if="item.attachmentUrl" class="attachment-preview mt-1">
              <img
                :src="item.attachmentUrl"
                alt="attachment"
                class="preview-img"
                @error="e => e.target.style.display='none'"
              />
            </div>
            <!-- បង្ហាញ icon បើគ្មាន attachment -->
            <div v-else class="no-attachment">
              <i class="bi bi-file-earmark-x text-muted"></i>
              <span class="text-muted small ms-1">គ្មានឯកសារ</span>
            </div>
          </div>
        </div>

        <div class="mobile-card__right">
          <div :class="item.category?.type === 'INCOME' ? 'amount--income' : 'amount--expense'">
            {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ item.amount?.toLocaleString() }}
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

  <!-- EMPTY -->
  <div v-else class="empty-state">
    <i class="bi bi-inbox fs-1 d-block mb-2"></i>
    គ្មានប្រតិបត្តិការថ្ងៃនេះ
  </div>
</template>

<style scoped>
.date-header-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-left: 4px;
}

.date-header {
  font-weight: 700;
  color: #6b7280;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

.date-header--today { color: #2563eb; }

.today-badge {
  display: inline-block;
  background: #dbeafe;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

/* TABLE */
.table-wrap {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}

.table { border-collapse: collapse; font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif; }

/* MOBILE CARD */
.mobile-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  border: 1.5px solid transparent;
}

.mobile-card--today { border-color: #2563eb; background: #f0f6ff; }

.mobile-card__left { display: flex; align-items: flex-start; gap: 12px; }

.mobile-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: grid; place-items: center; font-size: 16px; flex-shrink: 0;
}

.icon--income  { background: #dcfce7; color: #16a34a; }
.icon--expense { background: #fee2e2; color: #dc2626; }

.mobile-card__category { font-size: 14px; font-weight: 600; color: #111827; line-height: 1.3; }
.mobile-card__note     { font-size: 12px; color: #9ca3af; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.mobile-card__right { text-align: right; flex-shrink: 0; }

.amount--income  { font-size: 15px; font-weight: 700; color: #16a34a; }
.amount--expense { font-size: 15px; font-weight: 700; color: #dc2626; }

.mobile-card__time { font-size: 11px; color: #9ca3af; margin-top: 2px; }

/* ATTACHMENT */
.attachment-link {
  font-size: 13px; color: #2563eb; text-decoration: none;
  display: inline-flex; align-items: center; gap: 3px; margin-top: 2px;
}
.attachment-link:hover { text-decoration: underline; }

/* PREVIEW IMAGE */
.attachment-preview { margin-top: 6px; }
.preview-img {
  width: 80px; height: 60px; object-fit: cover;
  border-radius: 8px; border: 1px solid #e5e7eb;
}

/* NO ATTACHMENT */
.no-attachment {
  display: inline-flex; align-items: center; margin-top: 4px;
  font-size: 12px; color: #9ca3af;
}

/* EMPTY */
.empty-state {
  text-align: center; padding: 48px 0; color: #9ca3af;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

.mt-1 { margin-top: 4px; }
.ms-1 { margin-left: 4px; }
</style>