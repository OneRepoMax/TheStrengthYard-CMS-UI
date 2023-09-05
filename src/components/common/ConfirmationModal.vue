<template>
    <v-dialog max-width="400px" @input="$emit('input', $event)">
        <v-card :title="this.title">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>
            <v-card-text class="text-center">
                <v-icon size="130" :color="this.color">{{ icon }}</v-icon>
            </v-card-text>
            <v-card-text class="text-center">
                {{ this.message }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" md="6">
                        <v-btn block variant="outlined" :color="this.color" class="mb-5" @click="$emit('closeModal')">No</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn block :color="this.color" class="mb-5" @click="$emit('action')">Yes</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
    
<script>
export default {
    props: {
        value: Boolean,
        title: String,
        type: String,
        icon: String,
        color: String,
        message: String,
    },
}
</script>
