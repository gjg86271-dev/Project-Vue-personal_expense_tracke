<script>
export default {
  name: 'AuthTimelineSidebar',
  props: {
    steps: {
      type: Array,
      required: true,
    },
  },
  computed: {
    activeStepIndex() {
      return this.steps.findIndex((step) => step.status === 'active')
    },
    progressPercent() {
      const completedCount = this.steps.filter((step) => step.status === 'completed').length
      const currentStep = this.activeStepIndex >= 0 ? this.activeStepIndex + 1 : completedCount

      if (!this.steps.length) return 0

      return Math.round((currentStep / this.steps.length) * 100)
    },
  },
  methods: {
    isConnectorDone(index) {
      return this.steps[index - 1]?.status === 'completed' || this.activeStepIndex >= index
    },
    openLink(url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    },
  },
}
</script>

<template>
  <aside class="auth-sidebar" aria-label="Authentication steps">

    <!-- Animated background blobs -->
    <div class="blob blob-1" aria-hidden="true"></div>
    <div class="blob blob-2" aria-hidden="true"></div>
    <div class="blob blob-3" aria-hidden="true"></div>

    <!-- Top: Logo + App name -->
    <div class="sidebar-top">
      <div class="logo-wrap">
        <img src="@/assets/img/loginLogo.png" alt="Expense Tracker logo" class="brand-logo" />
        <div class="logo-glow" aria-hidden="true"></div>
      </div>
      <div class="brand-info">
        <h1 class="brand-title">ជំហានផ្ទៀងផ្ទាត់</h1>
        <p class="brand-sub">បន្តជំហានផ្ទៀងផ្ទាត់ ដើម្បីការពារគណនីរបស់អ្នក</p>
      </div>
    </div>

 
    <div class="section-label">
      <span></span>
      <p>ដំណើរការ</p>
      <span></span>
    </div>

    <!-- Timeline -->
    <nav class="steps" aria-label="Next steps">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="step"
        :class="step.status"
      >
        <!-- Connector -->
        <div v-if="index > 0" class="connector-wrap">
          <div class="connector" :class="{
            done: isConnectorDone(index),
          }">
            <div class="connector-dot" v-if="isConnectorDone(index)"></div>
          </div>
        </div>

        <div class="step-row">
          <!-- Icon -->
          <div class="step-icon-wrap">
            <!-- Completed -->
            <div v-if="step.status === 'completed'" class="icon-completed" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M4 10.5l4 4 8-8" stroke="white" stroke-width="2.2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div class="completed-ring"></div>
            </div>

            <!-- Active -->
            <div v-else-if="step.status === 'active'" class="icon-active" aria-hidden="true">
              <span>{{ step.id }}</span>
              <div class="pulse-ring ring-1"></div>
              <div class="pulse-ring ring-2"></div>
            </div>

            <!-- Pending -->
            <div v-else class="icon-pending" aria-hidden="true">
              <span>{{ step.id }}</span>
            </div>
          </div>

          <!-- Text -->
          <div class="step-text mb-2">
            <span class="step-number">STEP {{ step.id }}</span>
            <span class="step-label">{{ step.label }}</span>
            <span v-if="step.status === 'completed'" class="step-badge completed-badge">
              <i class="bi bi-check2"></i> រួចរាល់
            </span>

            <span v-else-if="step.status === 'active'" class="step-badge active-badge">
              <i class="bi bi-lightning-charge-fill"></i> កំពុងដំណើរការ
            </span>
          </div>
        </div>
      </div>
    </nav>

    <div class="progress-section ">
      <div class="progress-header">
        <span class="progress-label ">ដំណើរការសរុប</span>
        <span class="progress-pct">{{ progressPercent }}%</span>
      </div>
      <div class="progress-track ">
        <div
          class="progress-fill"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Help card -->
    <div class="help-card">
      <div class="help-icon-wrap">
        <i class="bi bi-patch-question-fill"></i>
      </div>
      <div class="help-text">
        <span class="help-title">ត្រូវការ ឬមានបញ្ហា?</span>
        <a
          href="https://t.me/insimnot"
          class="help-link"
          target="_blank"
          rel="noopener noreferrer"
          @click.prevent="openLink('https://t.me/insimnot')"
        >
          ទំនាក់ទំនង ពួកយើង
          <i class="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>

  </aside>
</template>

<style scoped>
.auth-sidebar {
  width: 300px;
  flex-shrink: 0;
  padding: 36px 30px 32px;
  background: linear-gradient(150deg, #1a4faa 0%, #0e3a82 45%, #091f55 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

.blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(40px);
  opacity: 0.18;
}

.blob-1 {
  width: 220px; height: 220px;
  background: #60a5fa;
  top: -60px; right: -60px;
  animation: blobFloat 8s ease-in-out infinite alternate;
}

.blob-2 {
  width: 160px; height: 160px;
  background: #34d399;
  bottom: 60px; left: -50px;
  animation: blobFloat 10s ease-in-out infinite alternate-reverse;
}

.blob-3 {
  width: 100px; height: 100px;
  background: #818cf8;
  top: 45%; right: 10px;
  animation: blobFloat 6s ease-in-out infinite alternate;
}

@keyframes blobFloat {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(12px, 18px) scale(1.08); }
}

.sidebar-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 26px;
  position: relative;
  z-index: 1;
}

.logo-wrap {
  position: relative;
  width: 62px; height: 62px;
  border-radius: 16px;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s;
  cursor: pointer;
}

.logo-wrap:hover { transform: scale(1.07) rotate(-2deg); }

.brand-logo { width: 46px; height: 46px; object-fit: contain; position: relative; z-index: 1; }

.logo-glow {
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  background: rgba(96,165,250,0.25);
  filter: blur(8px);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 1;   }
}

.brand-info { display: flex; flex-direction: column; gap: 3px; }

.brand-title {
  margin: 0;
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.brand-title span { color: #60d394; }

.brand-sub {
  margin: 0;
  color: rgba(255,255,255,0.55);
  font-size: 10.5px;
  line-height: 1.5;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.section-label span {
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.12);
}

.section-label p {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  white-space: nowrap;
}


.steps {
  --step-icon-size: 26px;
  --connector-width: 2px;
  --connector-offset: 12px;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 1;
}

.step { display: flex; flex-direction: column; }

/* Connector */
.connector-wrap {
  padding-left: var(--connector-offset);
  height: 34px;
  display: flex;
  align-items: stretch;
  margin: 4px 0;
}

.connector {
  width: var(--connector-width);
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
  position: relative;
  transition: background 0.4s;
}

.connector.done { background: #22c55e; }
.connector.half {
  background: linear-gradient(to bottom, #22c55e 50%, rgba(255,255,255,0.15) 50%);
}

.connector-dot {
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #22c55e;
}

/* Step row */
.step-row {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

/* Icon wrapper */
.step-icon-wrap {
  flex-shrink: 0;
  margin-top: 1px;
}

/* Completed icon */
.icon-completed {
  position: relative;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2), 0 2px 8px rgba(34,197,94,0.4);
}

.icon-completed svg {
  width: 14px; height: 14px;
}

.completed-ring {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  border: 1.5px solid rgba(34,197,94,0.3);
  animation: completedRingPop 0.4s ease-out forwards;
}

@keyframes completedRingPop {
  0%   { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}

/* Active icon */
.icon-active {
  position: relative;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.25);
}

.icon-active span {
  color: #1a4faa;
  font-size: 10px;
  font-weight: 900;
  position: relative;
  z-index: 1;
}

.pulse-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  animation: pulseOut 2s ease-out infinite;
}

.ring-1 { inset: -5px; animation-delay: 0s; }
.ring-2 { inset: -10px; animation-delay: 0.5s; }

@keyframes pulseOut {
  0%   { transform: scale(0.85); opacity: 0.8; }
  100% { transform: scale(1.4);  opacity: 0;   }
}

/* Pending icon */
.icon-pending {
  width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1.5px dashed rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-pending span {
  color: rgba(255,255,255,0.35);
  font-size: 10px;
  font-weight: 700;
}

/* Step text */
.step-text {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 2px;
  min-width: 0;
}

.step-number {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
}

.step-label {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.step.pending .step-label {
  color: rgba(255,255,255,0.35);
  font-weight: 500;
}

/* Badges */
.step-badge {
  position: absolute;
  top: calc(100% + 7px);
  left: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 700;
  white-space: nowrap;
  width: fit-content;
}

.completed-badge {
  background: rgba(34,197,94,0.18);
  color: #4ade80;
  border: 1px solid rgba(34,197,94,0.25);
}

.active-badge {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.2);
}


.progress-section {
  width: 100%;
  margin-top: 24px;
  padding: 14px 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  position: relative;
  z-index: 1;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 10.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
}

.progress-pct {
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
}

.progress-track {
  width: 100%;
  height: 5px;
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  border-radius: 999px;
  transition: width 0.6s ease;
  box-shadow: 0 0 8px rgba(34,197,94,0.5);
}


.help-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 24px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.help-icon-wrap {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.16);
  color: rgba(255,255,255,0.75);
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.help-card:hover .help-icon-wrap {
  background: rgba(255,255,255,0.16);
}

.help-text { display: flex; flex-direction: column; gap: 3px; }

.help-title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
}

.help-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  transition: gap 0.2s;
}

.help-link:hover { gap: 8px; }

/* ─────────────────────────────────────
   Responsive
───────────────────────────────────── */
@media (max-width: 900px) {
  .auth-sidebar {
    width: 100%;
    min-height: 0;
    padding: 16px 20px 18px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .sidebar-top {
    width: 100%;
    margin-bottom: 0;
    gap: 10px;
  }

  .logo-wrap { width: 44px; height: 44px; border-radius: 12px; }
  .brand-logo { width: 32px; height: 32px; }
  .brand-title { font-size: 14px; }
  .brand-sub { display: none; }

  .section-label,
  .step-text,
  .step-badge,
  .progress-section,
  .help-card,
  .blob { display: none; }

  .steps {
    --step-icon-size: 28px;
    --connector-offset: 0;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 2px 10px 0;
  }

  .step {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 0 0 auto;
    min-width: 0;
  }

  .step:not(:first-child) {
    flex: 1 1 0;
  }

  .connector-wrap {
    flex: 1 1 auto;
    padding-left: 0;
    margin: 0;
    height: 2px;
    align-items: center;
    min-width: 24px;
  }

  .connector { width: 100%; height: 2px; }
  .connector-dot { display: none; }

  .step-row {
    flex: 0 0 auto;
    gap: 0;
  }

  .step-icon-wrap { width: 28px; height: 28px; }

  .icon-completed,
  .icon-active,
  .icon-pending { width: 28px; height: 28px; }

  .icon-active span,
  .icon-pending span { font-size: 11px; }
  .icon-completed svg { width: 14px; height: 14px; }
}

@media (max-width: 480px) {
  .auth-sidebar { padding: 14px 16px 16px; }
  .steps { padding-inline: 2px; }
  .connector-wrap { min-width: 16px; }
}
</style>
