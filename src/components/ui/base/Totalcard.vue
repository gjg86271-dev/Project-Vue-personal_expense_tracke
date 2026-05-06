<template>
    <div class="card border-0 shadow">
        <div class="card-body">
            <div class="card-header-row">
                <div class="card-title">{{ title }}</div>
                <div class="card-icon">
                   <slot name="icon"></slot>
                </div>
            </div>
            <div class="card-subtitle">{{ formattedValue }}</div>
            <div class="card-text">


            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    value: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: ''
    },
    
})

const formattedValue = computed(() => {
    return `${props.currency}${props.value.toLocaleString()}`
})

const trendLabel = computed(() => {
    const sign = props.trend >= 0 ? '+' : ''
    return `${sign}${props.trend}%`
})
</script>

<style scoped>
.card {
    border-radius: 16px;
    background: #ffffff;
    /* width: 220px;
    font-family: 'Segoe UI', sans-serif; */
}

.card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.card-title {
    font-size: 18px;
    color: #9ca3af;
    font-weight: 500;
    font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

.card-icon {
    width: 38px;
    height: 38px;

    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    flex-shrink: 0;
    padding: 4px;
}

.card-icon svg {
    width: 18px;
    height: 18px;
}

.card-subtitle {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    line-height: 1.1;
}

.card-text {
    font-size: 13px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 3px;
}

.trend-icon {
    color: #22c55e;
    font-size: 14px;
}

.trend-value {
    color: #22c55e;
    font-weight: 600;
}

.trend-desc {
    color: #9ca3af;
}
</style>