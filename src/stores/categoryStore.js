import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/api' 

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])

  async function fetchAllCategories() {
    const response =  await api.get('categories?_page=1&_per_page=10&search&sortBy=id&sortDir=asc')
    categories.value = response.data.data.items
  }

  return {
    categories,
    fetchAllCategories
  }
 
})
