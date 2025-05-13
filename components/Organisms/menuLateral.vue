<script setup lang="ts">
import { ref, computed } from 'vue';
import SearchCNPJIcon from '~/components/Atoms/icons/searchCNPJIcon.vue';
import QrcodeIcon from '~/components/Atoms/icons/qrcodeIcon.vue';
import Sobre from '~/components/Atoms/icons/sobre.vue';
const isMobileMenuOpen = ref(false);

// Informações do usuário
const userName = ref('Marchioro');
const userInitials = computed(() => {
    return userName.value
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
});

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};


// Caminho atual (simulado - em um projeto real, use useRoute do vue-router)
const route = useRoute();
const isActive = (path: string) => {
    return route.path === path;
};


// Itens de navegação principal
const mainNavItems = [
    {
        name: 'Consulta TEF',
        path: '/',
        icon: SearchCNPJIcon

    },
    {
        name: 'Validador QWST',
        path: '/ValidadorQWST',
        icon: QrcodeIcon
    },

];

// Itens de navegação de configurações
const settingsNavItems = [

    {
        name: 'Sobre',
        path: '/sobre',
        icon: Sobre
    }
];
</script>
<template>
    <div>
        <!-- Overlay para dispositivos móveis (aparece quando o menu está aberto) -->
        <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            @click="toggleMobileMenu"></div>

        <!-- Botão de toggle para dispositivos móveis -->
        <button @click="toggleMobileMenu"
            class="fixed top-4 left-4 z-30 lg:hidden bg-emerald-600 text-white p-2 rounded-md shadow-md">
            <svg v-if="isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                </path>
            </svg>
        </button>

        <!-- Sidebar -->
        <aside
            class="fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            :class="[isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
            <!-- Logo e cabeçalho -->
            <div class="flex items-center justify-center h-16 border-b border-gray-200">
                <h1 class="text-xl font-bold text-emerald-600">MRC Validador</h1>
            </div>

            <!-- Links de navegação -->
            <nav class="mt-6 px-4">
                <div class="space-y-2">
                    <!-- Grupo de navegação: Principal -->
                    <div class="mb-6">
                        <h2 class="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Principal
                        </h2>
                        <a v-for="(item, index) in mainNavItems" :key="index" :href="item.path" :class="[
                            'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                            isActive(item.path) ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'
                        ]">
                            <span class="mr-3 text-lg">
                                <component :is="item.icon" class="h-4 w-4"></component>
                            </span>
                            {{ item.name }}
                        </a>
                    </div>

                    <!-- Grupo de navegação: Configurações -->
                    <div class="mb-6">
                        <h2 class="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Configurações
                        </h2>
                        <a v-for="(item, index) in settingsNavItems" :key="index" :href="item.path" :class="[
                            'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                            isActive(item.path) ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'
                        ]">
                            <span class="mr-3 text-lg">
                                <component :is="item.icon" class="h-5 w-5"></component>
                            </span>
                            {{ item.name }}
                        </a>
                    </div>
                </div>
            </nav>

            <!-- Rodapé do sidebar -->
            <div class="absolute bottom-0 w-full border-t border-gray-200 p-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <div
                            class="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                            {{ userInitials }}
                        </div>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                        <button class="text-xs text-gray-500 hover:text-emerald-600">Sair</button>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</template>