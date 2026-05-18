<template>
  <header class="navbar mx-2">
    <div class="navbar-left">
      <button class="icon-button me-2" @click="emit('toggle-sidebar')" type="button" aria-label="Toggle Sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <div class="brand-wrap">
        <img src="/src/assets/img/image.png" alt="ExpenseTracker" class="brand-icon" />
      </div>
    </div>

    <div class="navbar-right">

      <!-- Theme toggle -->
      <button class="icon-button" type="button" :aria-label="isDark ? 'ប្តូរទៅរបៀបភ្លឺ' : 'ប្តូរទៅរបៀបងងឹត'"
        @click="toggleTheme">
        <Transition name="theme-icon" mode="out-in">
          <svg v-if="!isDark" key="moon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else key="sun" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5" />
            <path
              d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </Transition>
      </button>

      <!-- Notification bell -->
      <div ref="notifTriggerRef" style="position:relative">
        <button class="icon-button" type="button" aria-label="Notifications" @click.stop="toggleNotif">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
        </button>
      </div>

      <div class="divider"></div>

      <!-- Profile -->
      <button class="profile" ref="triggerRef" @click.stop="toggleDropdown" type="button">
        <div class="avatar-ring">
          <img v-if="profile.avatarUrl" :src="profile.avatarUrl" :alt="profile.name" class="avatar-img" />
          <span v-else class="avatar-initials">{{ initials }}</span>
          <span class="status-dot"></span>
        </div>
        <div class="profile-text">
          <div class="profile-name">{{ profile.name || '—' }}</div>
          <div class="profile-email">{{ profile.email || '—' }}</div>
        </div>
        <svg class="chevron" :class="{ open: isOpen }" width="14" height="14" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </header>

  <!-- ── Notification panel ── -->
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="notifOpen" ref="notifMenuRef" class="notif-panel" :style="notifStyle" @click.stop>

        <div class="notif-head">
          <div class="notif-head-left">
            <span class="notif-title">ការជូនដំណឹង</span>
            <span v-if="unreadCount > 0" class="notif-count-badge">{{ unreadCount }}</span>
          </div>
          <button v-if="alerts.length" class="btn-mark-all" @click="markAllRead">
            សម្គាល់ទាំងអស់
          </button>
        </div>

        <div v-if="notifLoading" class="notif-state">
          <div class="spinner"></div>
          <span>កំពុងផ្ទុក...</span>
        </div>

        <div v-else-if="alerts.length === 0" class="notif-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style="opacity:.25">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>មិនមានការជូនដំណឹង</span>
        </div>

        <div v-else class="notif-list">
          <div v-for="a in alerts" :key="a.id" class="notif-item" :class="[`is-${a.level}`, { unread: !a.read }]"
            @click="markRead(a.id)">
            <div class="notif-icon" :class="`notif-icon--${a.level}`">
              <svg v-if="a.level === 'danger'" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="notif-body">
              <p class="notif-msg">{{ a.message }}</p>
              <div class="progress-row">
                <div class="progress-track">
                  <div class="progress-fill" :class="`progress-fill--${a.level}`"
                    :style="{ width: Math.min(a.percent, 100) + '%' }"></div>
                </div>
                <span class="progress-pct" :class="`pct--${a.level}`">{{ a.percent }}%</span>
              </div>
              <p class="notif-amounts">
                <span class="spent" :class="`spent--${a.level}`">${{ a.spent.toFixed(2) }}</span>
                <span class="limit-sep"> / </span>
                <span class="limit">${{ a.limit.toFixed(2) }}</span>
              </p>
            </div>
            <span v-if="!a.read" class="unread-dot"></span>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>

  <!-- ── Profile dropdown ── -->
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="isOpen" ref="menuRef" class="dropdown-menu" :style="menuStyle" @click.stop>

        <div class="dropdown-header">
          <div class="dd-avatar-ring">
            <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="dd-avatar-img" />
            <span v-else class="dd-avatar-initials">{{ initials }}</span>
            <span class="dd-status-dot"></span>
          </div>
          <div class="dd-user-info">
            <div class="dd-name">{{ profile.name || '—' }}</div>
            <div class="dd-email">{{ profile.email || '—' }}</div>
            <div class="dd-role-badge">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Premium
            </div>
          </div>
        </div>

        <div class="dd-group">
          <div class="dd-group-label">គណនី</div>

          <RouterLink to="/dashboard/profile" class="dd-item" @click="isOpen = false">
            <span class="dd-icon dd-icon--blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </span>
            <span class="dd-item-text">
              <span class="dd-item-label">គណនីរបស់អ្នក</span>
              <span class="dd-item-sub">Profile &amp; settings</span>
            </span>
          </RouterLink>

          <button class="dd-item" type="button" @click="toggleTheme; isOpen = false">
            <span class="dd-icon dd-icon--amber">
              <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15"
                height="15">
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke-linecap="round" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
            <span class="dd-item-text">
              <span class="dd-item-label">{{ isDark ? 'ប្តូរទៅរបៀបភ្លឺ' : 'ប្តូរទៅរបៀបងងឹត' }}</span>
              <span class="dd-item-sub">Toggle {{ isDark ? 'light' : 'dark' }} mode</span>
            </span>
          </button>
        </div>

        <div class="sep"></div>

        <div class="dd-group">
          <div class="dd-group-label">ទូទាត់</div>
          <RouterLink to="/dashboard/subscription" class="dd-item" @click="isOpen = false">
            <span class="dd-icon dd-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </span>
            <span class="dd-item-text">
              <span class="dd-item-label">Subscription</span>
              <span class="dd-item-sub">Manage your plan</span>
            </span>
            <span class="dd-plan-badge">Pro</span>
          </RouterLink>
        </div>

        <div class="sep"></div>

        <div class="dd-group">
          <button class="dd-item dd-item--danger" type="button" @click="handleLogout">
            <span class="dd-icon dd-icon--red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
            <span class="dd-item-text">
              <span class="dd-item-label">ចាកចេញ</span>
              <span class="dd-item-sub">Sign out of account</span>
            </span>
          </button>
        </div>

        <div class="dd-footer">
          <span class="dd-footer-meta">ExpenseTracker v2.0 • KH</span>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import api from '@/api/api'
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'

defineProps({
  isMobile: { type: Boolean, default: false }
})

const emit = defineEmits(['logout', 'toggle-sidebar'])

// ── Theme ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'app-theme'
const isDark = ref(
  localStorage.getItem(STORAGE_KEY) !== null
    ? localStorage.getItem(STORAGE_KEY) === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
)
function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}
function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

// ── Profile ────────────────────────────────────────────────────────────────
const profile = reactive({ name: '', email: '', avatarUrl: null })
const initials = computed(() =>
  profile.name
    ? profile.name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'
)
async function fetchProfile() {
  try {
    const res = await api.get('auth/profile')
    const data = res.data?.data ?? res.data
    profile.name = data.fullName ?? ''
    profile.email = data.email ?? ''
    profile.avatarUrl = data.avatar ?? null
  } catch (e) {
    console.error('profile fetch failed', e)
  }
}

// ── Budget alerts ──────────────────────────────────────────────────────────
const alerts = ref([])
const notifLoading = ref(false)
const readSet = ref(new Set(JSON.parse(localStorage.getItem('notif-read') || '[]')))

const unreadCount = computed(() => alerts.value.filter(a => !a.read).length)

function persistRead() {
  localStorage.setItem('notif-read', JSON.stringify([...readSet.value]))
}
function markRead(id) {
  readSet.value.add(id)
  persistRead()
  const a = alerts.value.find(a => a.id === id)
  if (a) a.read = true
}
function markAllRead() {
  alerts.value.forEach(a => { readSet.value.add(a.id); a.read = true })
  persistRead()
}

async function fetchBudgetAlerts() {
  notifLoading.value = true
  try {
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    let allBudgets = []
    try {
      const budgetRes = await api.get('budgets')
      allBudgets = budgetRes.data?.data?.items ?? []
    } catch (e) {
      console.error('budgets fetch failed:', e.response?.data)
      alerts.value = []
      return
    }

    const budgets = allBudgets.filter(
      b => b.month === month && b.year === year && b.category?.type === 'EXPENSE'
    )
    if (!budgets.length) { alerts.value = []; return }

    let txs = []
    try {
      const txRes = await api.get('transactions')
      txs = txRes.data?.data?.items ?? []
    } catch (e) {
      console.error('transactions fetch failed:', e.response?.data)
      alerts.value = []
      return
    }

    const currentTxs = txs.filter(tx => {
      const d = new Date(tx.transactionDate)
      return d.getMonth() + 1 === month && d.getFullYear() === year
    })

    const spentMap = {}
    for (const tx of currentTxs) {
      if (tx.category?.type !== 'EXPENSE') continue
      const cid = tx.category?.id ?? tx.categoryId
      if (cid) spentMap[cid] = (spentMap[cid] ?? 0) + (tx.amount ?? 0)
    }

    const result = []
    for (const b of budgets) {
      const cid = b.category?.id
      const spent = spentMap[cid] ?? 0
      const limit = b.limitAmount
      if (!limit) continue
      const percent = Math.round((spent / limit) * 100)
      if (percent < 80) continue

      const level = percent >= 100 ? 'danger' : 'warning'
      const id = `${b.id}-${month}-${year}`
      const catName = b.category?.name ?? '—'
      const message = percent >= 100
        ? `ចំណាយលើស! ${catName} (${percent}%)`
        : `ជិតដល់កម្រិត! ${catName} (${percent}%)`

      result.push({ id, level, message, category: catName, spent, limit, percent, read: readSet.value.has(id) })
    }

    result.sort((a, b) =>
      a.level === b.level ? b.percent - a.percent : a.level === 'danger' ? -1 : 1
    )
    alerts.value = result
  } catch (e) {
    console.error('budget alerts failed', e)
    alerts.value = []
  } finally {
    notifLoading.value = false
  }
}

// ── Notification panel ─────────────────────────────────────────────────────
const notifOpen = ref(false)
const notifTriggerRef = ref(null)
const notifMenuRef = ref(null)
const notifStyle = ref({})

function positionNotif() {
  const el = notifTriggerRef.value
  if (!el) return
  const btn = el.querySelector('button') ?? el
  const r = btn.getBoundingClientRect()

  const panelWidth = 320
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight

  let left = r.left
  if (left + panelWidth > viewportW - 8) left = viewportW - panelWidth - 8
  if (left < 8) left = 8

  let top = r.bottom + 8
  const estimatedHeight = 460
  if (top + estimatedHeight > viewportH) top = r.top - estimatedHeight - 8

  notifStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${Math.min(panelWidth, viewportW - 16)}px`,
    zIndex: 999999
  }
}

function toggleNotif() {
  isOpen.value = false
  notifOpen.value = !notifOpen.value
  if (notifOpen.value) nextTick(positionNotif)
}

// ── Profile dropdown ───────────────────────────────────────────────────────
const isOpen = ref(false)
const triggerRef = ref(null)
const menuRef = ref(null)
const menuStyle = ref({})

function positionMenu() {
  const el = triggerRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  if (!r.width) return

  const menuWidth = 260
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight

  let left = r.left
  if (left + menuWidth > viewportW - 8) left = viewportW - menuWidth - 8
  if (left < 8) left = 8

  let top = r.bottom + 8
  const estimatedHeight = 380
  if (top + estimatedHeight > viewportH) top = r.top - estimatedHeight - 8

  menuStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${menuWidth}px`,
    zIndex: 999999
  }
}

function toggleDropdown() {
  notifOpen.value = false
  isOpen.value = !isOpen.value
  if (isOpen.value) nextTick(positionMenu)
}

function handleLogout() {
  isOpen.value = false
  emit('logout')
}

// ── Outside click ──────────────────────────────────────────────────────────
function handleOutside(e) {
  if (
    !notifTriggerRef.value?.contains(e.target) &&
    !notifMenuRef.value?.contains(e.target)
  ) notifOpen.value = false

  if (
    !triggerRef.value?.contains(e.target) &&
    !menuRef.value?.contains(e.target)
  ) isOpen.value = false
}

// ── Resize / scroll reposition ─────────────────────────────────────────────
const onReposition = () => {
  if (notifOpen.value) positionNotif()
  if (isOpen.value) positionMenu()
}

onMounted(() => {
  applyTheme(isDark.value)
  fetchProfile()
  fetchBudgetAlerts()
  document.addEventListener('click', handleOutside)
  window.addEventListener('resize', onReposition)
  window.addEventListener('scroll', onReposition, true)
})
onUnmounted(() => {
  document.removeEventListener('click', handleOutside)
  window.removeEventListener('resize', onReposition)
  window.removeEventListener('scroll', onReposition, true)
})
</script>

<style scoped>
/* ── Navbar shell ── */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 20px;
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-button {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, .75);
  transition: var(--transition);
  flex-shrink: 0;
}

.icon-button:hover {
  background: rgba(255, 255, 255, .12);
  border-color: rgba(255, 255, 255, .18);
  color: #fff;
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: opacity .15s ease, transform .15s ease;
}
.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-30deg) scale(.75);
}
.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(30deg) scale(.75);
}

.brand-wrap {
  display: flex;
  align-items: center;
}

.brand-icon {
  width: 150px;
  height: 48px;
  object-fit: contain;
}

.divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, .2);
}

/* ── Notif badge ── */
.notif-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  background: var(--color-danger);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--bg-sidebar);
  pointer-events: none;
  line-height: 1;
}

/* ── Profile button ── */
.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: var(--transition);
  max-width: 220px;
}

.profile:hover {
  background: rgba(255, 255, 255, .12);
  border-color: rgba(255, 255, 255, .18);
}

.avatar-ring {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), #8b5cf6);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  position: relative;
  border: 1.5px solid rgba(255, 255, 255, .25);
  overflow: visible;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.avatar-initials {
  color: #fff;
  font-weight: 700;
  font-size: 13px;
}

.status-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 9px;
  height: 9px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--bg-sidebar);
}

/* Profile text — hidden on mobile */
.profile-text {
  display: none;
  flex-direction: column;
  text-align: left;
  min-width: 0;
  flex: 1;
}

.profile-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email {
  font-size: 11px;
  color: rgba(255, 255, 255, .6);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Chevron — hidden on mobile */
.chevron {
  display: none;
  transition: transform .2s ease;
  color: rgba(255, 255, 255, .6);
  flex-shrink: 0;
}

.chevron.open {
  transform: rotate(180deg);
}

@media (min-width: 576px) {
  .profile-text { display: flex; }
  .chevron      { display: block; }
}

/* ── Notification panel ── */
.notif-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 460px;
}

.notif-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px 11px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.notif-head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notif-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.notif-count-badge {
  background: rgba(99, 102, 241, .2);
  color: #818cf8;
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
  padding: 2px 7px;
}

.btn-mark-all {
  font-size: 11px;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-khmer);
  padding: 0;
}

.btn-mark-all:hover { opacity: .7; }

.notif-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 16px;
  color: var(--text-secondary);
  font-size: 13px;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 2.5px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.notif-list {
  overflow-y: auto;
  flex: 1;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background var(--transition);
  position: relative;
}

.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background: var(--bg-input); }
.notif-item.unread {
  background: color-mix(in srgb, var(--color-primary) 5%, transparent);
}

.notif-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  margin-top: 1px;
}

.notif-icon--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.notif-icon--warning {
  background: #fef3c7;
  color: #b45309;
}

:global(.dark) .notif-icon--warning {
  background: #451a03;
  color: #fbbf24;
}

.notif-body { flex: 1; min-width: 0; }

.notif-msg {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 7px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
}

.progress-track {
  flex: 1;
  height: 5px;
  background: var(--border-color);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width .5s ease;
}

.progress-fill--danger { background: var(--color-danger); }
.progress-fill--warning { background: #f59e0b; }

.progress-pct {
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

.pct--danger  { color: var(--color-danger); }
.pct--warning { color: #d97706; }

.notif-amounts {
  font-size: 11px;
  color: var(--text-secondary);
}

.spent--danger  { color: var(--color-danger); font-weight: 600; }
.spent--warning { color: #d97706; font-weight: 600; }
.limit-sep { color: var(--border-color); }

.unread-dot {
  width: 7px;
  height: 7px;
  background: var(--color-primary);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

/* ── Profile dropdown ── */
.dropdown-menu {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 12px;
  border-bottom: 1px solid var(--border-color);
}

.dd-avatar-ring {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--color-primary, #6366f1), #8b5cf6);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  position: relative;
}

.dd-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.dd-avatar-initials {
  color: #fff;
  font-weight: 700;
  font-size: 15px;
}

.dd-status-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--bg-card);
}

.dd-user-info { min-width: 0; }

.dd-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.dd-email {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 1px;
}

.dd-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  background: rgba(99, 102, 241, .18);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 10px;
  color: #818cf8;
  font-weight: 700;
}

.dd-group { padding: 6px 0; }

.dd-group-label {
  font-size: 10px;
  color: var(--text-secondary);
  padding: 2px 14px 6px;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.dd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  width: 100%;
  box-sizing: border-box;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 13px;
  font-family: var(--font-khmer);
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  transition: background .12s ease;
}

.dd-item:hover { background: var(--bg-input); }
.dd-item--danger { color: #f87171; }
.dd-item--danger:hover { background: rgba(239, 68, 68, .1); }

.dd-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
}

.dd-icon--blue  { background: rgba(99, 102, 241, .15); color: #818cf8; }
.dd-icon--green { background: rgba(34, 197, 94, .12);  color: #4ade80; }
.dd-icon--amber { background: rgba(251, 191, 36, .12); color: #fbbf24; }
.dd-icon--red   { background: rgba(239, 68, 68, .12);  color: #f87171; }

.dd-item-text {
  flex: 1;
  min-width: 0;
  display: inline-flex;
  flex-direction: column;
}

.dd-item-label {
  font-size: 13px;
  line-height: 1.3;
  color: inherit;
}

.dd-item-sub {
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 1px;
}

.dd-plan-badge {
  font-size: 10px;
  background: rgba(99, 102, 241, .2);
  color: #818cf8;
  border-radius: 6px;
  padding: 2px 8px;
  font-weight: 700;
  flex-shrink: 0;
}

.sep {
  height: 1px;
  background: var(--border-color);
}

.dd-footer {
  padding: 10px 14px 12px;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.dd-footer-meta {
  font-size: 10px;
  color: var(--text-secondary);
}

/* ── Panel transition ── */
:global(.panel-enter-active),
:global(.panel-leave-active) {
  transition: opacity .15s ease, transform .15s ease;
}

:global(.panel-enter-from),
:global(.panel-leave-to) {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Force teleported panels above everything ── */
:global(.notif-panel),
:global(.dropdown-menu) {
  z-index: 999999 !important;
}
</style>