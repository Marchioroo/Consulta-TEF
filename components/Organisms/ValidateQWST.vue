<script setup lang="ts">
import { limitNumber, formatDateTime } from '~/composables/Helpers/limitNumber'

definePageMeta({
    layout: 'default'  // Aqui você define que esta página vai usar o layout 'default'
});

// Estados do formulário
const numeroNota = ref('');
const serieNota = ref('');
const dataNota = ref('');
const numeroLoja = ref('');
const mostrarResultado = ref(false);
const isSubmitted = ref(false)

// Valor do QR Code e link de consluta
const qrCodeValue = computed(() => {
    return `https://consulta.exemplo.com.br/nota?numero=${numeroNota.value}&serie=${serieNota.value}&data=${dataNota.value}&loja=${numeroLoja.value}`;
});

const isValidate = computed(() => {
    let errors: { [key: string]: string | null } = {
        numeroNota: isSubmitted.value && !numeroNota.value.trim() ? 'Número da nota é obrigatório.' : null,
        serieNota: isSubmitted.value && !serieNota.value.trim() ? 'Série da nota é obrigatória.' : null,
        numeroLoja: isSubmitted.value && !numeroLoja.value.trim() ? 'Número da loja é obrigatório.' : null
    }

    // Verifica se todos os campos estão válidos
    const valid = Object.values(errors).every(error => error === null)

    return {
        valid,
        errors
    }
})

const dataBody = (NF: string, serieNF: string, Data: string,) => {


}
const linkConsulta = computed(() => {
    return qrCodeValue.value;
});

const buscarNota = () => {
    isSubmitted.value = true

    if (isValidate.value.valid) {
        fetchQWST()
        setTimeout(() => {
            mostrarResultado.value = true;
        }, 500);
    };
}

const fetchQWST = async () => {
    const url = 'http://7pa7e7rotd.execute-api.us-east-1.amazonaws.com/Prod/get_url/';


    const formattedDateTime = formatDateTime(new Date(dataNota.value));

    const body = {
        NF: `${numeroNota.value}_${serieNota.value}`,
        DEGUST: numeroLoja.value,
        DT_COMPRA: formattedDateTime
    };

    const { status, error, data } = await useFetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log(status.value, data.value, error.value);
};


// Função para formatar a data
const formatarData = (data: string) => {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
};




</script>
<template>
    <div class="mx-auto mt-10 flex justify-center items-center">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Validador de QWST</h2>

    </div>
    <div class="max-w-2xl mx-auto p-6  bg-white rounded-lg shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="space-y-2">
                <label for="numeroNota" class="block text-sm font-medium text-gray-700">Número da Nota</label>
                <input id="numeroNota" type="text" v-model="numeroNota" inputmode="numeric" pattern="[0-9]*"
                    maxlength="5" @input="limitNumber('numeroNota')"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ex: 123456" />
                <div v-if="isValidate.errors.numeroNota" class="text-sm text-red-500">
                    {{ isValidate.errors.numeroNota }}
                </div>
            </div>


            <div class="space-y-2">
                <label for="serieNota" class="block text-sm font-medium text-gray-700">Série da Nota</label>
                <input id="serieNota" type="text" v-model="serieNota" inputmode="numeric" pattern="[0-9]*" maxlength="3"
                    @input="limitNumber('serieNota')" class="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Ex: 001" />
                <div v-if="isValidate.errors.serieNota" class="text-sm text-red-500">
                    {{ isValidate.errors.serieNota }}
                </div>
            </div>

            <div class="space-y-2">
                <label for="dataNota" class="block text-sm font-medium text-gray-700">Data da Nota</label>
                <input id="dataNota" v-model="dataNota" type="datetime-local"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" />

            </div>

            <div class="space-y-2">
                <label for="numeroLoja" class="block text-sm font-medium text-gray-700">Número da Loja</label>
                <input id="numeroLoja" v-model="numeroLoja" type="text" maxlength="5" inputmode="numeric"
                    pattern="[0-9]*" @input="limitNumber(numeroLoja)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Ex: 0042" />
                <div v-if="isValidate.errors.numeroLoja" class="text-sm text-red-500">
                    {{ isValidate.errors.numeroLoja }}
                </div>
            </div>
        </div>

        <div class="flex justify-center">
            <button @click="buscarNota"
                class="px-6 py-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700">
                Buscar
            </button>
        </div>

        <!-- Resultado da busca -->
        <div v-if="mostrarResultado" class="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Resultado da Consulta</h3>

            <div class="flex flex-col md:flex-row items-center gap-6">
                <div class="flex-shrink-0">
                    <div
                        class="qrcode-placeholder w-[200px] h-[200px] bg-white border-4 border-white shadow-md flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-sm text-gray-500">QR Code</div>
                            <div class="text-xs text-gray-400 mt-2">{{ qrCodeValue.substring(0, 20) }}...</div>
                        </div>
                    </div>
                </div>

                <div class="flex-grow space-y-4">
                    <div class="bg-white p-4 rounded-md shadow-sm">
                        <h4 class="font-medium text-gray-700 mb-2">Detalhes da Nota</h4>
                        <p><span class="font-medium">Número:</span> {{ numeroNota }}</p>
                        <p><span class="font-medium">Série:</span> {{ serieNota }}</p>
                        <p><span class="font-medium">Data:</span> {{ formatarData(dataNota) }}</p>
                        <p><span class="font-medium">Loja:</span> {{ numeroLoja }}</p>
                    </div>

                    <a :href="linkConsulta" target="_blank"
                        class="inline-flex items-center text-emerald-600 hover:text-emerald-800">
                        Acessar consulta completa
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>