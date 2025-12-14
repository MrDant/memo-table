<template>
  <div class="bg-white rounded-lg shadow-xl p-8">
    <div class="grid grid-cols-5 gap-4 mb-8">
      <div
        v-for="number in numbers"
        :key="number"
        class="border-2 rounded-lg p-6 text-center transition-all duration-200 hover:shadow-lg cursor-pointer"
        :class="selectedNumber === number ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'"
        @click="selectNumber(number)"
      >
        <div class="text-3xl font-bold text-gray-700 mb-2">{{ number }}</div>
        <div class="text-5xl min-h-[60px] flex items-center justify-center">
          <Icon 
            v-if="icons[number] && icons[number].icon" 
            :icon="icons[number].icon" 
            :width="48" 
            :height="48"
            class="text-indigo-600"
          />
          <span v-else-if="icons[number] && icons[number].text" class="text-2xl font-semibold text-indigo-600">
            {{ icons[number].text }}
          </span>
          <span v-else>❓</span>
        </div>
        <button
          v-if="icons[number]"
          @click.stop="removeIcon(number)"
          class="mt-2 text-xs text-red-500 hover:text-red-700"
        >
          Supprimer
        </button>
      </div>
    </div>

    <div v-if="selectedNumber !== null" class="border-t pt-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">
        Sélectionner une icône pour le chiffre {{ selectedNumber }}
      </h2>
      <div class="mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une icône (ex: pomme, chien, voiture...) ou entrez un mot directement"
          @keyup.enter="handleEnterKey"
          class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
        />
        <p v-if="searchQuery && allIcons.length === 0 && !isLoading" class="mt-2 text-sm text-gray-600">
          Aucune icône trouvée. Appuyez sur Entrée pour utiliser "{{ searchQuery }}" comme texte.
        </p>
      </div>
      <div v-if="isLoading" class="text-center text-gray-500 py-8">
        Recherche en cours...
      </div>
      <div v-else-if="allIcons.length > 0" class="grid grid-cols-8 gap-3 max-h-96 overflow-y-auto">
        <button
          v-for="icon in allIcons"
          :key="icon"
          @click="assignIcon(icon)"
          class="p-4 border-2 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200 flex items-center justify-center"
          :class="icons[selectedNumber] && icons[selectedNumber] === icon ? 'border-indigo-500 bg-indigo-100' : 'border-gray-200'"
          :title="icon"
        >
          <Icon 
            :icon="icon" 
            :width="32" 
            :height="32"
            class="text-gray-700"
          />
        </button>
      </div>
      <div v-else-if="searchQuery && !isLoading" class="text-center text-gray-500 py-8">
        <p class="mb-4">Aucune icône trouvée pour "{{ searchQuery }}"</p>
        <button
          @click="assignTextIcon"
          class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Utiliser "{{ searchQuery }}" comme texte
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

const numbers = Array.from({ length: 10 }, (_, i) => i)
const selectedNumber = ref(null)
const icons = ref({})
const searchQuery = ref('')
const isLoading = ref(false)
const allIcons = ref([])

// Collections d'icônes spécifiques à utiliser
const iconCollections = [
  'streamline-kameleon-color',
  'cryptocurrency-color',
  'fluent-emoji-flat',
  'circle-flags'
]

// Charger les icônes des collections spécifiées
const loadIconsFromCollections = async () => {
  // if (allIcons.value.length > 0) return // Déjà chargé
  
  isLoading.value = true
  
  const response = await fetch(`https://api.iconify.design/search?prefixes=${iconCollections.join(',')}&query=${searchQuery.value}`)
  if (response.ok) {
    const collection = await response.json()
    if (collection && collection.icons) {
      allIcons.value = collection.icons
    } else {
      allIcons.value = [collection.icons]
    }
  } else {
    console.warn(`Collection ${collectionName} not found (${response.status})`)
  }
  isLoading.value = false
}

// Rechercher les icônes dans les collections chargées
const searchIconsFromAPI = async (query) => {
  if (!query.trim()) return []
  
  const searchQuery = query.toLowerCase().trim()
  await loadIconsFromCollections()
  
  // Limiter à 200 résultats pour les performances
  return allIcons.value.slice(0, 200)
}

// Watcher pour rechercher les icônes en temps réel avec debounce
let searchTimeout = null
watch(searchQuery, (newQuery) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!newQuery.trim()) {
    allIcons.value = []
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  searchTimeout = setTimeout(async () => {
    allIcons.value = await searchIconsFromAPI(newQuery)
  }, 300)
})

const selectNumber = (number) => {
  selectedNumber.value = number
  searchQuery.value = ''
}

const assignIcon = (icon) => {
  if (selectedNumber.value !== null) {
    icons.value[selectedNumber.value] = {
      id: icon,
      icon: icon,
      text: icon
    }
    searchQuery.value = ''
  }
}

const assignTextIcon = () => {
  if (selectedNumber.value !== null && searchQuery.value.trim()) {
    icons.value[selectedNumber.value] = {
      id: `text:${searchQuery.value}`,
      icon: null,
      text: searchQuery.value.trim()
    }
    searchQuery.value = ''
  }
}

const handleEnterKey = () => {
  if (allIcons.value.length === 0 && searchQuery.value.trim()) {
    assignTextIcon()
  }
}

const removeIcon = (number) => {
  delete icons.value[number]
}
</script>
