<template>
    <v-card class="text-center max-width">
        <v-card-title class="text-h4 justify-center mt-2 align-center d-flex">
            <v-icon :icon="this.icon" size="small" class="mr-3"/>
            {{ this.value }}
        </v-card-title>
        <v-card-text>
            <p>
                {{this.title}}
            </p>
        </v-card-text>
    </v-card>

</template>

<script>
export default {
    props: {
        title: String,
        value: Number,
        icon: String,
    },
}
</script>