<template>
    <Header />
    <main>
        <slot />
    </main>
    <OrganismsFooter />
</template>

<script setup>
import Header from '~/components/Header.vue';
</script>