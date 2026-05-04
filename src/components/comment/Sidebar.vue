<template>
  <div class="sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <h2>ចំណាយ</h2>
    </div>

    <!-- Navigation Items -->
    <div class="sidebar-content">
      <!-- Dashboard -->
      <div class="nav-item">
        <i class="icon-grid"></i>
        <span>ផ្ទាំងគ្រប់គ្រង</span>
      </div>

      <!-- Reports -->
      <div class="nav-item">
        <i class="icon-document"></i>
        <span>របាយការណ៍</span>
      </div>

      <!-- Statistics Button -->
      <button class="btn-statistics">
        <i class="icon-chart"></i>
        <span>ស្ថិតិលម្អិត</span>
      </button>

      <!-- Sign Out Button -->
      <button class="btn-signin">
        <i class="icon-signin"></i>
        <span>ចូល</span>
      </button>

      <!-- Divider -->
      <hr class="divider">

      <!-- Logout -->
      <div class="nav-item logout">
        <i class="icon-logout"></i>
        <span>ចាកចេញ</span>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.sidebar {
  flex: 0 0 260px;
  width: 260px;
  max-width: 260px;
  padding: 18px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  color: #666;
  border-radius: 8px;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.nav-item:hover {
  background-color: #d9e7ff;
  color: #1a3a7a;
  transform: translateX(2px);
}

.btn-statistics {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #a8c5e8;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-statistics:hover {
  background-color: #94b5d8;
  transform: translateY(-1px);
}

.btn-signin {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #003d7a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: white;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-signin:hover {
  background-color: #002d5a;
  transform: translateY(-1px);
}

.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 8px 0;
}

.logout {
  color: #ff0000;
  font-weight: 500;
  transition: color 0.2s ease, transform 0.2s ease;
}

.logout:hover {
  color: #cc0000;
  transform: translateX(2px);
}

</style>