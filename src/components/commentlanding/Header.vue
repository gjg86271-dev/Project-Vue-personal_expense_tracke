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
              <RouterLink class="nav-link nav-item-link" to="function">មុខងារ</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link nav-item-link" to="about">អំពីយើង</RouterLink>
            </li>
          </ul>

          <!-- Right Buttons -->
          <div class="navbar-right">
            <RouterLink to="/login" class="btn btn-outline-primary rounded-5 px-4">
              ចូលប្រើ
            </RouterLink>
            <RouterLink to="/dashboard" class="btn btn-primary rounded-5 px-5">
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
  height: 68px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.06);
  padding: 0 20px;
}

.brand-icon {
  width: 160px;
  height: 60px;
  object-fit: contain;
}

/* ===== NAV LINKS ===== */
.nav-item-link {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
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
  gap: 12px;
}

.btn-outline-primary {
  border-color: #1565D8;
  color: #1565D8;
  font-size: 14px;
}

.btn-outline-primary:hover {
  background: #EEF4FF;
  border-color: #1565D8;
  color: #1565D8;
}

.btn-primary {
  background: #1565D8;
  border-color: #1565D8;
  font-size: 14px;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1251b5;
  border-color: #1251b5;
}

/* ===== MOBILE (md and below) ===== */
@media (max-width: 991.98px) {
  .navbar {
    height: auto;
    padding: 12px 16px;
  }

  .nav-collapse-box {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
    padding: 16px;
    margin-top: 12px;
  }

  .navbar-nav {
    flex-direction: column;
    gap: 4px !important;
    margin-bottom: 12px !important;
  }

  .nav-item-link {
    display: block;
    padding: 10px 14px;
  }

  .navbar-right {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .navbar-right .btn {
    width: 100%;
    text-align: center;
    padding: 10px;
  }
}
.navbar-right .btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.navbar-right .btn:hover {
    transform: scale(1.08);
}
.navbar-right .btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.navbar-right .btn-outline-primary:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
}

.navbar-right .btn-primary:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}
.navbar-right .btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    will-change: transform;
}
</style>