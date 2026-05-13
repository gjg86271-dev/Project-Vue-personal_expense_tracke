<script setup>
import { computed } from 'vue'

const props = defineProps({
    transactions: {
        type: Array,
        default: () => []
    }
})

const groupedItems = computed(() => {
    const sorted = [...props.transactions].sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
    )

    return sorted.reduce((groups, item) => {
        const dateKey = new Date(item.transactionDate).toLocaleDateString('km-KH', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
        if (!groups[dateKey]) groups[dateKey] = []
        groups[dateKey].push(item)
        return groups
    }, {})
})
</script>

<template>
    <div v-if="transactions.length > 0">
        <div v-for="(group, date) in groupedItems" :key="date" class="mb-4">

            <!-- Date Header -->
            <h6 class="fw-bold text-secondary mb-2 px-1">📅 {{ date }}</h6>

            <table class="table shadow border-start mb-0">
                <thead class="table-secondary">
                    <tr class="text-center">
                        <th>ម៉ោង</th>
                        <th>កំណត់ចំណាំ</th>
                        <th>ប្រភេទ</th>
                        <th>ចំណូល/ចំណាយ</th>
                        <th>ចំនួនទឹកប្រាក់</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="text-center" v-for="item in group" :key="item.id">
                        <td class="text-muted small">
                            {{ new Date(item.transactionDate).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) }}
                        </td>
                        <td>{{ item.notes }}</td>
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
                            {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ item.amount.toLocaleString() }}
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="text-center py-5 text-muted">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        គ្មានប្រតិបត្តិការ
    </div>
</template>

<style scoped>
.table {
    border-radius: 16px !important;
    overflow: hidden;
    border-collapse: separate;
    border-spacing: 0;
}
</style>