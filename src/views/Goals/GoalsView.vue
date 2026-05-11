
<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="header">
      <div>
        <h1>គោលដៅ</h1>
        <p>តាមដានគោលដៅសន្សំរបស់អ្នក</p>
      </div>

      <button class="add-btn">
        បន្ថែមគោលដៅ
        <span>+</span>
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        
        <h4>គោលដៅសរុប</h4>
        <h2>3</h2>
        <p>active</p>
      </div>

      <div class="stat-card">
        
        <h4>ប្រាក់សន្សំសរុប</h4>
        <h2>$260,000</h2>
        <p>across all goals</p>
      </div>

      <div class="stat-card">
        
        <h4>នៅសល់</h4>
        <h2>$530,000</h2>
        <p>to reach targets</p>
      </div>
    </div>

    <!-- Goal Cards -->
    <div
      class="goal-card"
      v-for="goal in goals"
      :key="goal.id"
    >
      <!-- Top -->
      <div class="goal-top">
        <div class="goal-info">
        

          <div>
            <div class="title-row">
              <h3>{{ goal.name }}</h3>

        
            </div>

            <p>គោលដៅសន្សំ</p>
          </div>
        </div>

        <div class="actions">
          <span>
            <i class="bi bi-pencil-square"></i>
          </span>
          <span>
            <i class="bi bi-trash3"></i>
          </span>
        </div>
      </div>

      <!-- Progress -->
      <div class="progress-section">
        <div class="progress-label">
          <span>{{ goal.progress }}% completed</span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: goal.progress + '%',
              background: goal.color
            }"
          ></div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="goal-bottom">
        <div>
          <h2>${{ goal.saved.toLocaleString() }}</h2>
          <p>បានសន្សំ</p>
        </div>

        <div class="remaining">
          <h2>${{ goal.remaining.toLocaleString() }}</h2>
          <p>នៅសល់</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="buttons">
        <button class="save-btn">បន្ថែមប្រាក់</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const goals = [
  {
    id: 1,
    name: 'វិស្សមកាល',
    progress: 30,
    saved: 60000,
    remaining: 140000,
    color: '#ff7a00'
  },
  {
    id: 2,
    name: 'ផ្ទះថ្មី',
    progress: 25,
    saved: 125000,
    remaining: 375000,
    color: '#149647'
  },
  {
    id: 3,
    name: 'មូលនិធិបន្ទាន់',
    progress: 85,
    saved: 85000,
    remaining: 15000,
    color: '#149647'
  }
]
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.dashboard {
  padding: 30px;
  background: #f7f8fc;
  min-height: 100vh;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1d2433;
}

.header p {
  color: #9aa4b2;
  margin-top: 5px;
}

.add-btn {
  border: 2px solid #d6dff0;
  background: white;
  padding: 12px 20px;
  border-radius: 30px;
  color: #5c6bc0;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-btn span {
  font-size: 18px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 35px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.top-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 18px;
}

.stat-card h4 {
  color: #687385;
  margin-bottom: 12px;
  font-size: 15px;
}

.stat-card h2 {
  font-size: 34px;
  color: #101828;
  margin-bottom: 5px;
}

.stat-card p {
  color: #98a2b3;
  font-size: 14px;
}

/* Goal Card */
.goal-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.goal-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.goal-icon {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #1f2a44;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-row h3 {
  font-size: 22px;
  color: #101828;
}

.risk {
  background: #dcfce7;
  color: #16a34a;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.goal-info p {
  color: #98a2b3;
  margin-top: 5px;
}

.actions {
  display: flex;
  gap: 14px;
  font-size: 18px;
  cursor: pointer;
}

/* Progress */
.progress-section {
  margin-bottom: 25px;
}

.progress-label {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  font-weight: 600;
  color: #374151;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #dbe2ef;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 20px;
}

/* Bottom */
.goal-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.goal-bottom h2 {
  font-size: 34px;
  font-weight: 700;
}

.goal-bottom p {
  color: #98a2b3;
  margin-top: 5px;
}

.remaining {
  text-align: right;
}

.remaining h2 {
  color: #f59e0b;
}

/* Buttons */
.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.save-btn {
  background: #2450c5;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}

.details-btn {
  border: 2px solid #d6dff0;
  background: white;
  color: #8ea2c8;
  padding: 14px 22px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .goal-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .remaining {
    text-align: left;
  }

  .buttons {
    flex-direction: column;
  }
}
</style>
