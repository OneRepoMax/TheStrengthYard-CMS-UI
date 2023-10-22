<template>
    <v-card elevation="3" class="rounded-0 rounded-md mb-md-3 mb-1">
        <v-carousel hide-delimiters show-arrows="hover" continuous cycle height="230px">
            <template v-for="(ads, index) in adsList" :key="index">
                <v-carousel-item :src="ads.src" @click.prevent="openNewTab(ads.path)" cover>
                    <v-chip class="text-caption font-weight-bold mt-3 ml-2" style="background-color: white;">{{ title }}</v-chip>
                </v-carousel-item>
            </template>
        </v-carousel>
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
  