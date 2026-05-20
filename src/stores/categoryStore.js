import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/api'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const meta = ref({ totalItems: 0, totalPages: 0, currentPage: 1, perPage: 10 })
  const loading = ref(false)
  const error = ref(null)

  const params = ref({
    _page: 1,
    _per_page: 10,
    search: '',
    sortBy: 'id',
    sortDir: 'asc',
  })

  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/categories', { params: params.value })
      categories.value = res.data?.data?.items ?? []
      meta.value = res.data?.data?.meta ?? meta.value
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      error.value = err.message || 'Failed to fetch categories'
    } finally {
      loading.value = false
    }
  }

  async function fetchAllCategories() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/categories', {
        params: {
          _page: 1,
          _per_page: 100,
          sortBy: 'id',
          sortDir: 'asc',
        }
      })
      categories.value = res.data?.data?.items ?? []
    } catch (err) {
      console.error('Failed to fetch all categories:', err)
      error.value = err.message || 'Failed to fetch categories'
    } finally {
      loading.value = false
    }
  }

  // ── GET BY ID ─────────────────────────────────────────────────────────────
  async function getCategoryById(id) {
    try {
      const res = await api.get(`/categories/${id}`)
      return res.data?.data ?? null
    } catch (err) {
      console.error('Failed to fetch category by id:', err)
      return null
    }
  }

  async function createCategory({ name, type }) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/categories', { name, type })
      categories.value.push(res.data?.data)
      return { success: true }
    } catch (err) {
      console.error('Failed to create category:', err)
      error.value = err.message || 'Failed to create category'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id, { name, type }) {
    loading.value = true
    error.value = null
    try {
      const res = await api.put(`/categories/${id}`, { name, type })
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) categories.value[index] = res.data?.data
      return { success: true }
    } catch (err) {
      console.error('Failed to update category:', err)
      error.value = err.message || 'Failed to update category'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter(c => c.id !== id)
      return { success: true }
    } catch (err) {
      console.error('Failed to delete category:', err)
      error.value = err.message || 'Failed to delete category'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  function goToPage(page) {
    params.value._page = page
    fetchCategories()
  }

  function setSearch(search) {
    params.value.search = search
    params.value._page = 1
    fetchCategories()
  }

  function setSort(sortBy, sortDir = 'asc') {
    params.value.sortBy = sortBy
    params.value.sortDir = sortDir
    fetchCategories()
  }

  const incomeCategories = computed(() =>
    categories.value.filter(c => c.type === 'INCOME')
  )

  const expenseCategories = computed(() =>
    categories.value.filter(c => c.type === 'EXPENSE')
  )

  const systemCategories = computed(() =>
    categories.value.filter(c => c.isSystem)
  )

  const userCategories = computed(() =>
    categories.value.filter(c => !c.isSystem)
  )

  return {
    categories,
    meta,
    loading,
    error,
    params,
    fetchCategories,
    fetchAllCategories,
    getCategoryById,      // ← បន្ថែម
    createCategory,
    updateCategory,
    deleteCategory,
    goToPage,
    setSearch,
    setSort,
    incomeCategories,
    expenseCategories,
    systemCategories,
    userCategories,
  }
})