<template>
  <div class="not-found-page">
    <!-- Sidebar placeholder to match layout feel -->
    
      <!-- Logo -->
     

      <!-- Fake nav items -->
      

    <!-- Main content -->
    <div class="nf-main d-flex flex-column">
      <!-- Top bar -->
   

      <!-- 404 Content Area -->
      <div class="nf-content flex-grow-1 d-flex align-items-center justify-content-center p-4">
        <div class="nf-card">

          <!-- Top blue header strip -->
        

          <!-- Card body -->
          <div class="card-body-custom text-center">

            <!-- 404 Number -->
            <div class="error-number-wrap mb-3">
              <span class="error-digit">4</span>
              <div class="error-icon-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none"
                  stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="11"/>
                  <line x1="11" y1="14" x2="11.01" y2="14"/>
                </svg>
              </div>
              <span class="error-digit">4</span>
            </div>

            <!-- Badge -->
            <div class="error-badge mb-3">
              <span>Page Not Found</span>
            </div>

            <!-- Khmer message -->
            <h5 class="error-title mb-2">រកមិនឃើញទំព័រ</h5>
            <p class="error-desc mb-4">
              ទំព័រដែលអ្នកស្វែងរកមិនមានទេ ឬត្រូវបានផ្លាស់ប្តូររួចហើយ។<br/>
              សូមត្រឡប់ទៅទំព័រដើម ឬព្យាយាមម្តងទៀត។
            </p>

            <!-- Mini stat cards (decorative, matching dashboard) -->
           

            <!-- Action Buttons -->
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <RouterLink to="/" class="btn-primary-nf">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                ទំព័រដើម
              </RouterLink>

              <button @click="goBack" class="btn-secondary-nf">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                ត្រឡប់ក្រោយ
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.go(-1)

const navItems = [1, 2, 3, 4, 5, 6, 7]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Hanuman:wght@300;400;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.not-found-page {
  display: flex;
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'Hanuman', 'Battambang', sans-serif;
}

/* ─── Sidebar ─── */
.nf-sidebar {
  width: 230px;
  min-height: 100vh;
  background: linear-gradient(180deg, #1a56c4 0%, #1445a8 100%);
  flex-shrink: 0;
}

.nf-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
}
.logo-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
}

.nf-nav-items { display: flex; flex-direction: column; gap: 6px; }
.nf-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 10px;
  opacity: 0.3;
}
.nav-icon-box {
  width: 22px; height: 22px; border-radius: 5px;
  background: rgba(255,255,255,0.5);
}
.nav-label-box {
  height: 10px; width: 80px; border-radius: 4px;
  background: rgba(255,255,255,0.4);
}

/* ─── Main area ─── */
.nf-main {
  flex: 1;
  min-height: 100vh;
}

/* ─── Top bar ─── */
.nf-topbar {
  height: 64px;
  background: #1a56c4;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.topbar-title-box {
  height: 14px; width: 160px; border-radius: 6px;
  background: rgba(255,255,255,0.3);
}
.topbar-icon {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
}
.topbar-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.4);
}

/* ─── Content ─── */
.nf-content {
  background: #f0f4f8;
}

/* ─── Card ─── */
.nf-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(26, 86, 196, 0.10);
  overflow: hidden;
  width: 100%;
  max-width: 520px;
  animation: slideUp 0.5s ease both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card-header-strip {
  height: 10px;
  background: linear-gradient(90deg, #1a56c4, #2196F3);
  display: flex; align-items: center;
  padding: 0 14px;
}
.header-dots { display: flex; gap: 5px; }
.header-dots span {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,255,255,0.5);
}

.card-body-custom {
  padding: 36px 32px 32px;
}

/* ─── 404 Number ─── */
.error-number-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.error-digit {
  font-size: 90px;
  font-weight: 900;
  color: #1a56c4;
  line-height: 1;
  font-family: 'Hanuman', sans-serif;
}

.error-icon-center {
  width: 90px; height: 90px;
  background: linear-gradient(135deg, #1a56c4, #2196F3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 20px rgba(26, 86, 196, 0.35);
  flex-shrink: 0;
  animation: iconBounce 2.5s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* ─── Badge ─── */
.error-badge {
  display: inline-block;
  background: #e8f0fe;
  color: #1a56c4;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 20px;
  letter-spacing: 0.05em;
}

/* ─── Text ─── */
.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a3a7c;
}
.error-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.8;
}

/* ─── Mini Cards ─── */
.mini-cards {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.mini-card {
  flex: 1;
  max-width: 130px;
  background: #f8faff;
  border: 1px solid #e8eef8;
  border-radius: 12px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.mini-card span {
  font-size: 0.7rem;
  color: #9ca3af;
}
.mini-card strong {
  font-size: 1rem;
  color: #374151;
  font-weight: 700;
}
.mini-card-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.mini-card-icon.green { background: #22c55e; }
.mini-card-icon.red   { background: #ef4444; }
.mini-card-icon.gray  { background: #6b7280; }

/* ─── Buttons ─── */
.btn-primary-nf {
  display: inline-flex; align-items: center;
  padding: 10px 24px;
  background: #1a56c4;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Hanuman', sans-serif;
}
.btn-primary-nf:hover {
  background: #1445a8;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(26,86,196,0.35);
  color: white;
}

.btn-secondary-nf {
  display: inline-flex; align-items: center;
  padding: 10px 24px;
  background: white;
  color: #1a56c4;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1.5px solid #d1dff8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Hanuman', sans-serif;
}
.btn-secondary-nf:hover {
  background: #f0f4ff;
  border-color: #1a56c4;
  transform: translateY(-1px);
}

/* ─── Responsive ─── */
@media (max-width: 576px) {
  .card-body-custom { padding: 24px 20px; }
  .error-digit { font-size: 64px; }
  .error-icon-center { width: 64px; height: 64px; }
  .mini-cards { gap: 8px; }
}
</style>