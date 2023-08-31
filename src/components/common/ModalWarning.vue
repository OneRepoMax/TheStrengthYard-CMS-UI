<template>
    <v-dialog max-width="400px" @input="$emit('input', $event)">
        <v-card>
            <v-card-text class="text-end mb-0 pb-0">
                <v-btn icon="mdi-close" variant="text" @click="this.$emit('closeModal')" ></v-btn>
            </v-card-text>
            <v-card-text class="text-center">
                <v-icon size="130" color="red-darken-2">{{ icon }}</v-icon>
            </v-card-text>
            <v-card-title class="text-center">
                {{ this.title }}
            </v-card-title>
            <v-card-text class="text-center">
                {{ this.message }}
            </v-card-text>
            <v-card-text>
                <v-btn block color="red"  class="mb-5" @click="navigate(path), this.$emit('actionModal')">Ok</v-btn>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
    
<script>
export default {
    props: {
        value: Boolean,
        path: String,
        title: String,
        icon: String,
        message: String,
        action: String,
    },
    methods: {
        navigate(path){
            this.$router.push(path)
        }
    }
}
</script>
