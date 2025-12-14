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
          {{ icons[number] || '❓' }}
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
      <div class="grid grid-cols-8 gap-3">
        <button
          v-for="icon in availableIcons"
          :key="icon"
          @click="assignIcon(icon)"
          class="text-4xl p-4 border-2 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all duration-200"
          :class="icons[selectedNumber] === icon ? 'border-indigo-500 bg-indigo-100' : 'border-gray-200'"
        >
          {{ icon }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const numbers = Array.from({ length: 10 }, (_, i) => i)
const selectedNumber = ref(null)
const icons = ref({})

const availableIcons = [
  '🍎', '🍌', '🍊', '🍇', '🍓', '🍒', '🥝', '🍑',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
  '⭐', '🌟', '💫', '✨', '🔥', '💎', '🎯', '🎲',
  '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎮', '🕹️',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
  '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔',
  '❤️', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎'
]

const selectNumber = (number) => {
  selectedNumber.value = number
}

const assignIcon = (icon) => {
  if (selectedNumber.value !== null) {
    icons.value[selectedNumber.value] = icon
  }
}

const removeIcon = (number) => {
  delete icons.value[number]
}
</script>

