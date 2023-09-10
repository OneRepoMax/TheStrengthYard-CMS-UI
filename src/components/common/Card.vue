<template>
    <v-card class="text-center max-width">
        <v-card-text>
            <p>{{this.title}}</p>
        </v-card-text>
        <v-card-text class="text-h3 mb-5">
            {{ this.message }}
        </v-card-text>
    </v-card>

</template>

<script>
export default {
    props: {
        title: String,
        message: String,
    },
}
</script>