<template>
    <!-- Modal d'entraînement -->
    <UModal :prevent-close="true">
        <template #content>
        <UCard class="bg-indigo-50 text-gray-700">
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-800">
                    Convertis les icônes !
                </h2>
                <div class=" p-6">
                    <div class="flex flex-wrap justify-center gap-4">
                        <div
                            v-for="(number, index) in sequence"
                            :key="index"
                            class="flex flex-col items-center"
                        >
                            <div class="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
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
                            </div>
                        </div>
                    </div>
                    <label class="block text-sm font-medium mb-2">
                        Entre les chiffres correspondants (sans espaces)
                    </label>
                    <input
                        v-model="answerInput"
                        type="text"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        placeholder="Ex: 12345"
                        @keyup.enter="checkAnswer"
                        class="w-full px-4 color border-2 rounded-lg focus:outline-none text-center text-2xl font-mono tracking-widest"
                        :class="answerStatus === 'correct' ? 'border-green-500 bg-green-50' : answerStatus === 'incorrect' ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'"
                        :disabled="answerStatus !== null" />

                    <div v-if="answerStatus">
                        <UAlert 
                            v-if="answerStatus === 'correct'" 
                            color="green" 
                            icon="i-heroicons-check-circle"
                            title="Excellent ! Bonne réponse !"
                        />
                        <UAlert 
                            v-else
                            color="red" 
                            icon="i-heroicons-x-circle"
                            title="Oups ! Réponse incorrecte"
                        >
                            <template #description>
                            <div>La bonne réponse était : <strong>{{ sequence.join("") }}</strong></div>
                            </template>
                        </UAlert>
                    </div>
                    <UButton @click="() => answerStatus ? updateSequence() : checkAnswer()" :label="answerStatus ? 'Rejouer' : 'Valider'" block class="my-2"/>

                </div>
             
            </div>
        </UCard>
    </template>
    </UModal>
</template>
  
<script setup>
    import { ref, computed, nextTick } from 'vue'
    import { Icon } from '@iconify/vue'
    import { useStorage } from '@vueuse/core'

    const icons = useStorage("my-icons", {})
    const sequence = ref([])
    const answerInput = ref()
    const answerStatus = ref(null)

    onMounted(() => {
        updateSequence()
        console.log('init', sequence.value)
    })

    const updateSequence = () => {
        const nb = Math.floor(Math.random()*10) + 4
        sequence.value = []
        answerStatus.value = null
        answerInput.value = ""
        for (let i = 0; i < nb; i++) {
            sequence.value.push(Math.floor(Math.random()*10));
        }

    }

    const checkAnswer = () => {
        answerStatus.value = (answerInput.value == sequence.value.join('')) ? 'correct' : 'non'
    }

</script>