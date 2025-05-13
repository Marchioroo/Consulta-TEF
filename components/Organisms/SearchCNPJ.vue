<script setup lang="ts">
import { useServersStore } from "~/stores/useServersStore"
import type { ServerType, ServerInfo } from "~/types/serverInterface";


const serverStore = useServersStore();
const cnpj = ref('')
const servers = ref<ServerType[]>([])
const companyData = ref<ServerInfo[]>([])
const loading = ref(false)
const error = ref()

definePageMeta({
    layout: 'default'  // Aqui você define que esta página vai usar o layout 'default'
});

onMounted(() => {
    serverStore.FetchListServers();
})
servers.value = serverStore.servers

// Formata o CNPJ enquanto o usuário digita
const formatCNPJ = () => {
    // Remove todos os caracteres não numéricos
    let value = cnpj.value.replace(/\D/g, '')

    // Limita a 14 dígitos
    if (value.length > 14) {
        value = value.slice(0, 14)
    }

    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (value.length > 0) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2')
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
        value = value.replace(/(\d{4})(\d)/, '$1-$2')
    }

    cnpj.value = value
}

// Formata o CNPJ para exibição
const formatCNPJDisplay = (value: string) => {
    if (!value) return ''

    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

// Valida o CNPJ
const isValidCNPJ = computed(() => {
    const cnpjClean = cnpj.value.replace(/\D/g, '')

    if (cnpjClean.length !== 14) {
        return false
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpjClean)) {
        return false
    }

    // Validação do primeiro dígito verificador
    let sum = 0
    let weight = 5

    for (let i = 0; i < 12; i++) {
        sum += parseInt(cnpjClean.charAt(i)) * weight
        weight = weight === 2 ? 9 : weight - 1
    }

    let digit = 11 - (sum % 11)
    const firstVerifier = digit > 9 ? 0 : digit

    // Validação do segundo dígito verificador
    sum = 0
    weight = 6

    for (let i = 0; i < 13; i++) {
        sum += parseInt(cnpjClean.charAt(i)) * weight
        weight = weight === 2 ? 9 : weight - 1
    }

    digit = 11 - (sum % 11)
    const secondVerifier = digit > 9 ? 0 : digit

    return (
        parseInt(cnpjClean.charAt(12)) === firstVerifier &&
        parseInt(cnpjClean.charAt(13)) === secondVerifier
    )
})



// Busca os dados do CNPJ (simulado)
const searchCNPJ = async () => {
    if (!isValidCNPJ.value) {
        error.value = 'CNPJ inválido. Verifique o número informado.'
        return
    }

    const cnpjClean = cnpj.value.replace(/\D/g, '')  // Limpeza do CNPJ

    loading.value = true
    error.value = null
    companyData.value = []

    try {
        // Chama a função para buscar os dados do CNPJ
        await serverStore.FetchCnpjTef(cnpjClean)

        // Acessa os dados após a requisição
        const dataCnpj = serverStore.dataCnpj
        console.log('dataCnpj', dataCnpj)

        if (dataCnpj.length > 0) {
            companyData.value = dataCnpj  // Atribui os dados ao companyData
        } else {
            error.value = 'Nenhuma empresa encontrada para esse CNPJ.'
        }

    } catch (err) {
        console.error('Erro ao buscar CNPJ:', err)
        error.value = 'Erro ao fazer requisição. Tente novamente mais tarde.'
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Consulta de CNPJ</h1>

            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="mb-6">
                    <label for="cnpj" class="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <div class="flex">
                        <input id="cnpj" v-model="cnpj" type="text" placeholder="XX.XXX.XXX/XXXX-XX"
                            class="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none"
                            @input="formatCNPJ" @keyup.enter="searchCNPJ" />
                        <button @click="searchCNPJ"
                            class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-r-md transition-colors"
                            :disabled="loading || !isValidCNPJ">
                            <span v-if="!loading">Consultar</span>
                            <span v-else class="flex items-center justify-center">
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                            </span>
                        </button>
                    </div>
                    <p v-if="cnpj && !isValidCNPJ" class="mt-1 text-sm text-red-600">
                        CNPJ inválido. Verifique o número informado.
                    </p>
                </div>

                <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <p class="text-red-700">{{ error }}</p>
                </div>

                <div v-if="companyData.length > 0" class="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <!-- <h2 class="text-xl font-semibold text-gray-900 mb-4">{{  }}</h2> -->

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">CNPJ</h3>
                            <p class="text-gray-900">{{ formatCNPJDisplay(cnpj) }}</p>
                        </div>

                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Loja </h3>
                            <p class="text-gray-900">{{ companyData[0]?.nomeLoja
                                || 'Não informado' }}</p>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Codigo loja </h3>
                            <p class="text-gray-900">{{ companyData[0]?.codigoLoja
                                || 'Não informado' }}</p>
                        </div>

                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Código da empresa</h3>
                            <p class="text-gray-900">{{ companyData[0]?.codigoEmpresa }}</p>
                        </div>

                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Empresa</h3>
                            <p class="text-gray-900">{{ companyData[0]?.nomeEmpresa }}</p>
                        </div>



                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Servidor</h3>
                            <p class="text-gray-900">{{ companyData[0]?.nomeServidor }}</p>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Senha</h3>
                            <p class="text-gray-900">{{ companyData[0]?.senhaConfiguracao }}</p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>
