<template>
  <div class="container d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="width: 400px;">
      <div class="text-center mb-4">
        <h3 class="fw-bold">Login</h3>
        <p class="text-muted">Welcome back</p>
      </div>
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle"></i>
       
      </div>
      
      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control rounded-3" placeholder="Enter your email">
          <small class="text-danger"></small>
        </div>
          <!-- Password -->
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control rounded-3" placeholder="Enter your password">
              <small class="text-danger"></small>

             </div>
            <!-- Button -->
            <div class="d-grid">
              <button type="submit" class="btn btn-primary rounded-3">
                <div  class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">កំពុងចូល</span>
                </div>
              </button>
              
            </div>
            
      </form>
    </div>
  </div>
</template>

<script setup>
</script>