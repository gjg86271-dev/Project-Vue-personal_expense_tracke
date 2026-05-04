<template>
  <header class="navbar">
    <div class="navbar-left">
      <div class="brand">
        <div class="image">
          <img src="/src/assets/img/image.png" alt="" class="brand-icon" />
        </div>
      </div>
    </div>

    <div class="navbar-right">
      <button class="icon-button" type="button" aria-label="Notifications">
        🔔
      </button>

      <div class="profile">
        <div class="avatar">CP</div>
        <div class="profile-text">
          <div class="profile-name">Chea Phing</div>
          <div class="profile-email">cheaphing32@gmail.com</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>


</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 150px;
  height: 65px;

}

.brand-title {
  font-weight: 700;
  font-size: 16px;
  color: #111827;
}

.brand-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-button {
  background: #1d4ed8;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  cursor: pointer;
  font-weight: 600;
}

.icon-button {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-size: 18px;
  cursor: pointer;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.profile-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.profile-email {
  font-size: 12px;
  color: #6b7280;
}
</style>
