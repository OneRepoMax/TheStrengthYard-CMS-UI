<template>
    <v-card elevation="3" class="mb-3">
        <v-carousel hide-delimiters show-arrows="hover" continuous cycle height="230px">
            <template v-for="(ads, index) in adsList" :key="index">
                <v-carousel-item :src="ads.src" @click.prevent="openNewTab(ads.path)" cover></v-carousel-item>
            </template>
        </v-carousel>
        <v-card-subtitle class="text-subtitle-5 font-weight-semi-bold">{{ title }}</v-card-subtitle>
    </v-card>
</template>
  
<script>
export default {
    props: {
        adsList: Array,
        title: String,
    },
    methods: {
        openNewTab(url) {
            // Use window.open to open the link in a new tab
            window.open(url, "_blank");
        },
    },
};
</script>
  