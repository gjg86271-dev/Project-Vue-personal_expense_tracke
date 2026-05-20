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
      <button class="icon-button" type="button"
        :aria-label="isDark ? 'ប្តូរទៅរបៀបភ្លឺ' : 'ប្តូរទៅរបៀបងងឹត'"
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

      <!-- Profile dropdown trigger -->
      <div ref="profileTriggerRef" style="position:relative">
        <button class="profile-btn" type="button" @click.stop="toggleProfile" aria-label="Profile menu">
          <div class="avatar">
            <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" class="avatar-img" />
            <span v-else>{{ avatarInitials }}</span>
          </div>
          <span class="profile-name">{{ user?.name || 'គណនី' }}</span>
          <svg class="chevron" :class="{ open: profileOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

    </div>
  </header>

  <!-- Notification panel -->
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
          <div
            v-for="a in alerts"
            :key="a.id"
            class="notif-item"
            :class="[`is-${a.level}`, { unread: !a.read }]"
            @click="markRead(a.id)"
          >
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
                  <div
                    class="progress-fill"
                    :class="`progress-fill--${a.level}`"
                    :style="{ width: Math.min(a.percent, 100) + '%' }"
                  ></div>
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

  <!-- Profile dropdown panel -->
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="profileOpen" ref="profileMenuRef" class="profile-panel" :style="profileStyle" @click.stop>

        <div class="profile-head">
          <div class="avatar avatar--lg">
            <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" class="avatar-img" />
            <span v-else>{{ avatarInitials }}</span>
          </div>
          <div class="profile-head-info">
            <p class="profile-head-name">{{ user?.name || '—' }}</p>
            <p class="profile-head-email">{{ user?.email || '—' }}</p>
          </div>
        </div>

        <div class="profile-list">
          <router-link to="/dashboard/profile" class="profile-item" @click="profileOpen = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            គណនីរបស់ខ្ញុំ
          </router-link>

          <div class="profile-sep"></div>

          <button class="profile-item profile-item--danger" type="button" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            ចាកចេញ
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import api from '@/api/api'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  isMobile: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()

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
applyTheme(isDark.value)
function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

// ── User profile ───────────────────────────────────────────────────────────
const user = ref(null)

const avatarInitials = computed(() => {
  const name = user.value?.name || ''
  return name.trim().charAt(0).toUpperCase() || 'U'
})

/**
 * Extract user object from any API response shape:
 *   { data: { data: { name, email, ... } } }   ← Laravel Resource nested
 *   { data: { name, email, ... } }              ← standard wrapper
 *   { name, email, ... }                        ← flat response
 *
 * Also normalises common field aliases so user.name always has a value:
 *   full_name | username | first_name + last_name → name
 */
function extractUser(responseData) {
  // Unwrap one or two levels of "data"
  const raw =
    responseData?.data?.data ??
    responseData?.data ??
    responseData ??
    null

  if (!raw) return null

  // Build a normalised copy so downstream code always reads `user.name`
  const normalised = { ...raw }

  if (!normalised.name) {
    if (raw.fullName) {
      normalised.name = raw.fullName
    } else if (raw.full_name) {
      normalised.name = raw.full_name
    } else if (raw.firstName || raw.first_name) {
      const first = raw.firstName || raw.first_name || ''
      const last  = raw.lastName  || raw.last_name  || ''
      normalised.name = `${first} ${last}`.trim()
    } else if (raw.username) {
      normalised.name = raw.username
    }
  }

  return normalised
}

// ── Fetch user ─────────────────────────────────────────────────────────────
const fetchUser = async () => {
  try {
    const res = await api.get('auth/profile')
    user.value = extractUser(res.data)
  } catch (e) {
    console.error('fetchUser failed', e)
  }
}

// ── Profile dropdown ───────────────────────────────────────────────────────
const profileOpen       = ref(false)
const profileTriggerRef = ref(null)
const profileMenuRef    = ref(null)
const profileStyle      = ref({})

function positionProfile() {
  const el = profileTriggerRef.value
  if (!el) return
  const r          = el.getBoundingClientRect()
  const panelWidth = 220
  const viewportW  = window.innerWidth
  let left = r.right - panelWidth
  if (left < 8) left = 8
  if (left + panelWidth > viewportW - 8) left = viewportW - panelWidth - 8
  profileStyle.value = {
    position: 'fixed',
    top: `${r.bottom + 8}px`,
    left: `${left}px`,
    width: `${panelWidth}px`,
    zIndex: 999999,
  }
}

function toggleProfile() {
  notifOpen.value = false
  profileOpen.value = !profileOpen.value
  if (profileOpen.value) nextTick(positionProfile)
}

async function handleLogout() {
  profileOpen.value = false
  try { await api.post('auth/logout') } catch (_) {}
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  router.push({ name: 'login' })
}

// ── Budget alerts ──────────────────────────────────────────────────────────
const alerts       = ref([])
const notifLoading = ref(false)
const readSet      = ref(new Set(JSON.parse(localStorage.getItem('notif-read') || '[]')))
const unreadCount  = computed(() => alerts.value.filter(a => !a.read).length)

function persistRead() { localStorage.setItem('notif-read', JSON.stringify([...readSet.value])) }
function markRead(id)  { readSet.value.add(id); persistRead(); const a = alerts.value.find(a => a.id === id); if (a) a.read = true }
function markAllRead() { alerts.value.forEach(a => { readSet.value.add(a.id); a.read = true }); persistRead() }

async function fetchBudgetAlerts() {
  notifLoading.value = true
  try {
    const now   = new Date()
    const month = now.getMonth() + 1
    const year  = now.getFullYear()

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

    const result    = []
    const activeIds = new Set()

    for (const b of budgets) {
      const cid     = b.category?.id
      const spent   = spentMap[cid] ?? 0
      const limit   = b.limitAmount
      if (!limit) continue
      const percent = Math.round((spent / limit) * 100)
      if (percent < 80) continue

      const level   = percent >= 100 ? 'danger' : 'warning'
      const id      = `${b.id}-${month}-${year}`
      const catName = b.category?.name ?? '—'
      const message = percent >= 100
        ? `ចំណាយលើស! ${catName} (${percent}%)`
        : `ជិតដល់កម្រិត! ${catName} (${percent}%)`

      activeIds.add(id)
      result.push({ id, level, message, category: catName, spent, limit, percent, read: readSet.value.has(id) })
    }

    for (const id of [...readSet.value]) {
      if (!activeIds.has(id)) readSet.value.delete(id)
    }
    persistRead()

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
const notifOpen       = ref(false)
const notifTriggerRef = ref(null)
const notifMenuRef    = ref(null)
const notifStyle      = ref({})

function positionNotif() {
  const el = notifTriggerRef.value
  if (!el) return
  const r          = el.getBoundingClientRect()
  const panelWidth = 320
  const viewportW  = window.innerWidth
  const viewportH  = window.innerHeight
  let left = r.left
  if (left + panelWidth > viewportW - 8) left = viewportW - panelWidth - 8
  if (left < 8) left = 8
  let top = r.bottom + 8
  if (top + 460 > viewportH) top = r.top - 460 - 8
  notifStyle.value = {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    width: `${Math.min(panelWidth, viewportW - 16)}px`,
    zIndex: 999999,
  }
}

function toggleNotif() {
  profileOpen.value = false
  notifOpen.value = !notifOpen.value
  if (notifOpen.value) nextTick(positionNotif)
}

function handleOutside(e) {
  if (!notifTriggerRef.value?.contains(e.target) && !notifMenuRef.value?.contains(e.target))
    notifOpen.value = false
  if (!profileTriggerRef.value?.contains(e.target) && !profileMenuRef.value?.contains(e.target))
    profileOpen.value = false
}

const onReposition = () => {
  if (notifOpen.value) positionNotif()
  if (profileOpen.value) positionProfile()
}

onMounted(() => {
  fetchUser()
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
  color: rgba(255,255,255,.75);
  transition: var(--transition);
  flex-shrink: 0;
}
.icon-button:hover {
  background: rgba(255,255,255,.12);
  border-color: rgba(255,255,255,.18);
  color: #fff;
}

.theme-icon-enter-active,
.theme-icon-leave-active { transition: opacity .15s ease, transform .15s ease; }
.theme-icon-enter-from   { opacity: 0; transform: rotate(-30deg) scale(.75); }
.theme-icon-leave-to     { opacity: 0; transform: rotate(30deg) scale(.75); }

.brand-wrap { display: flex; align-items: center; }
.brand-icon { width: 150px; height: 48px; object-fit: contain; }

/* ── Notif badge ── */
.notif-badge {
  position: absolute; top: 2px; right: 2px;
  min-width: 16px; height: 16px; padding: 0 3px;
  background: var(--color-danger); color: #fff;
  font-size: 9px; font-weight: 700; border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--bg-sidebar); pointer-events: none; line-height: 1;
}

/* ── Notification panel ── */
.notif-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex; flex-direction: column;
  max-height: 460px;
}

.notif-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 16px 11px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}
.notif-head-left { display: flex; align-items: center; gap: 8px; }
.notif-title { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.notif-count-badge {
  background: rgba(99,102,241,.2); color: #818cf8;
  font-size: 10px; font-weight: 700; border-radius: 6px; padding: 2px 7px;
}
.btn-mark-all {
  font-size: 11px; color: var(--color-primary); background: none;
  border: none; cursor: pointer; font-family: var(--font-khmer); padding: 0;
}
.btn-mark-all:hover { opacity: .7; }

.notif-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 10px; padding: 32px 16px;
  color: var(--text-secondary); font-size: 13px;
}
.spinner {
  width: 22px; height: 22px;
  border: 2.5px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.notif-list { overflow-y: auto; flex: 1; }
.notif-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 16px; border-bottom: 1px solid var(--border-color);
  cursor: pointer; transition: background var(--transition); position: relative;
}
.notif-item:last-child { border-bottom: none; }
.notif-item:hover      { background: var(--bg-input); }
.notif-item.unread     { background: color-mix(in srgb, var(--color-primary) 5%, transparent); }

.notif-icon {
  width: 30px; height: 30px; border-radius: 8px;
  flex-shrink: 0; display: grid; place-items: center; margin-top: 1px;
}
.notif-icon--danger  { background: var(--color-danger-light); color: var(--color-danger); }
.notif-icon--warning { background: #fef3c7; color: #b45309; }
:global(.dark) .notif-icon--warning { background: #451a03; color: #fbbf24; }

.notif-body { flex: 1; min-width: 0; }
.notif-msg { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.4; margin-bottom: 7px; }
.progress-row { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
.progress-track { flex: 1; height: 5px; background: var(--border-color); border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 999px; transition: width .5s ease; }
.progress-fill--danger  { background: var(--color-danger); }
.progress-fill--warning { background: #f59e0b; }
.progress-pct { font-size: 11px; font-weight: 700; flex-shrink: 0; }
.pct--danger  { color: var(--color-danger); }
.pct--warning { color: #d97706; }
.notif-amounts { font-size: 11px; color: var(--text-secondary); }
.spent--danger  { color: var(--color-danger); font-weight: 600; }
.spent--warning { color: #d97706; font-weight: 600; }
.limit-sep { color: var(--border-color); }
.unread-dot {
  width: 7px; height: 7px; background: var(--color-primary);
  border-radius: 50%; flex-shrink: 0; margin-top: 4px;
}

/* ── Profile button ── */
.profile-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  color: rgba(255, 255, 255, .9);
  transition: var(--transition);
}
.profile-btn:hover {
  background: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .15);
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  overflow: hidden;
}
.avatar--lg { width: 38px; height: 38px; font-size: 15px; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }

.profile-name {
  font-size: 13px;
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron { transition: transform .2s; opacity: .6; }
.chevron.open { transform: rotate(180deg); }

/* ── Profile panel ── */
.profile-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.profile-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
}
.profile-head-info { min-width: 0; }
.profile-head-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.profile-head-email {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-list { padding: 6px; }
.profile-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: var(--transition);
  font-family: var(--font-khmer);
}
.profile-item:hover { background: var(--bg-input); }
.profile-item svg   { flex-shrink: 0; opacity: .55; }
.profile-item:hover svg { opacity: 1; }

.profile-sep { height: 1px; background: var(--border-color); margin: 4px 0; }

.profile-item--danger { color: var(--color-danger); }
.profile-item--danger svg { opacity: .7; }
.profile-item--danger:hover { background: var(--color-danger-light); }

/* ── Panel transitions ── */
:global(.panel-enter-active),
:global(.panel-leave-active) { transition: opacity .15s ease, transform .15s ease; }
:global(.panel-enter-from),
:global(.panel-leave-to)     { opacity: 0; transform: translateY(-6px); }

:global(.notif-panel),
:global(.profile-panel) { z-index: 999999 !important; }
</style>