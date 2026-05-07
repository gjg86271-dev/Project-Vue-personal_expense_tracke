<template>
    <header class="navbar"  style="font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;" >
        <div class="navbar-left">
            <img src="/src/assets/img/image.png" alt="ExpenseTracker" class="brand-icon" />
        </div>

        <div class="navbar-right">
          
            <RouterLink to="/login" class="btn btn-secondary px-5 rounded-5 border-secondary">ចូលប្រើគណនី</RouterLink>
            <div class="divider"></div>

            
        </div>
    </header>
</template>
<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
}
.brand-icon {
  width: 160px;
  height: 60px;
  object-fit: contain;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Bell button — no border, just icon */
.icon-button {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: 8px;
  transition: background 0.15s;
}

.icon-button:hover {
  background: #f1f5f9;
  color: #111827;
}

/* Vertical divider between bell and profile */
.divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

/* Real photo avatar */
.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

/* Fallback initials avatar */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.profile-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  line-height: 1.3;
}

.profile-email {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
  line-height: 1.3;
}
</style>