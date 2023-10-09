<template>
    <v-dialog max-width="400px" @input="$emit('input', $event)">
        <v-card :title="this.title">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="this.$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>
            <v-card-text class="text-center">
                <v-icon size="130" color="green-darken-2">{{ icon }}</v-icon>
            </v-card-text>
            <v-card-text class="text-center">
                {{ this.message }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-btn block color="teal" class="mb-5" @click="navigate(path)">Ok</v-btn>
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
        closeOnClick: Boolean
    },
    methods: {
        navigate(path) {
            if (this.closeOnClick) {
                this.$emit('closeModal')
            } else {
                this.$router.push(path)
            }
        }
    }
}
</script>
