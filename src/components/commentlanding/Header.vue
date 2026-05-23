<template>
  <header style="font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;">
    <nav class="navbar navbar-expand-lg" style="z-index: 999;">
      <div class="container">

        <!-- Logo -->
        <div class="navbar-left">
          <img src="/src/assets/img/image.png" alt="ExpenseTracker" class="brand-icon" />
        </div>

        <!-- Toggler (mobile) -->
        <button
          class="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Nav Links + Buttons -->
        <div class="collapse navbar-collapse nav-collapse-box" id="navbarSupportedContent">
          <ul class="navbar-nav m-auto mb-2 mb-lg-0 gap-2">
            <li class="nav-item">
              <RouterLink class="nav-link nav-item-link" aria-current="page" to="homelanding">
                ទំព័រដើម
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link nav-item-link" to="function">
                មុខងារ
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link nav-item-link" to="about">
                អំពីយើង
              </RouterLink>
            </li>
          </ul>

          <!-- Right Buttons -->
          <div class="navbar-right">
            <RouterLink to="/login" class="btn btn-outline-primary rounded-5 px-4">
              ចូលប្រើ
            </RouterLink>

            <RouterLink to="/register" class="btn btn-primary rounded-5 px-5">
              ចុះឈ្មោះ
            </RouterLink>
          </div>
        </div>

      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>

/* ===== NAVBAR BASE ===== */
.navbar {
  width: 100%;
  min-height: 78px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.06);
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.container {
  max-width: 1320px;
}

/* ===== LEFT ===== */
.navbar-left {
  display: flex;
  align-items: center;
}

.brand-icon {
  width: 220px;
  height: 72px;
  object-fit: contain;
}

/* ===== COLLAPSE ===== */
.nav-collapse-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ===== NAV LINKS ===== */
.navbar-nav {
  align-items: center;
}

.nav-item-link {
  font-size: 18px;
  color: #374151;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
  white-space: nowrap;
}

.nav-item-link:hover,
.nav-item-link.router-link-active {
  background: #EEF4FF;
  color: #1565D8;
}

/* ===== RIGHT BUTTONS ===== */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: 20px;
}

.navbar-right .btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  will-change: transform;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
}

.btn-outline-primary {
  border-color: #1565D8;
  color: #1565D8;
  background: transparent;
}

.btn-outline-primary:hover {
  background: #EEF4FF;
  border-color: #1565D8;
  color: #1565D8;
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
}

.btn-primary {
  background: #1565D8;
  border-color: #1565D8;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1251b5;
  border-color: #1251b5;
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

/* ===== LARGE SCREEN FIX ===== */
@media (min-width: 992px) {
  .navbar .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .navbar-collapse {
    flex-grow: 1;
  }

  .navbar-nav {
    margin-left: auto;
    margin-right: auto;
  }
}

/* ===== MOBILE ===== */
/* ===== MOBILE FIX ===== */
@media (max-width: 991.98px) {

  .navbar {
    padding: 10px 14px;
    min-height: auto;
  }

  /* FIX logo + toggle */
  .navbar .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand-icon {
    width: 150px;
    height: 50px;
    object-fit: contain;
  }

  /* FIX dropdown box */
  .nav-collapse-box {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
    padding: 18px;
    margin-top: 14px;
  }

  /* FIX nav menu vertical */
  .navbar-nav {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px !important;
    margin-bottom: 18px !important;
  }

  .nav-item {
    width: 100%;
  }

  /* FIX active menu */
  .nav-item-link {
    width: 100%;
    display: block;
    padding: 14px 16px;
    border-radius: 14px;
    font-size: 18px;
  }

  /* FIX button section */
  .navbar-right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-left: 0;
  }

  /* FIX full width buttons */
  .navbar-right .btn {
    width: 100%;
    padding: 12px;
    font-size: 18px;
    text-align: center;
    border-radius: 999px;
  }

  /* FIX toggle icon */
  .navbar-toggler {
    padding: 6px 10px;
    border-radius: 12px;
    border: 2px solid #666 !important;
    box-shadow: none !important;
  }

  .navbar-toggler:focus {
    box-shadow: none;
  }
}
</style>