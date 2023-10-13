<template>
    <v-dialog max-width="400px" @input="$emit('input', $event)">
        <v-card :title="this.title">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>

            <v-card-text v-if="this.title == 'Booking Successful'" class="text-center">
                <v-icon size="130" :color="this.color">{{ this.icon }}</v-icon>
            </v-card-text>

            <!-- Class slot header -->
            <v-card-item>
                <v-card-title class="text-wrap">
                    {{ this.className }}
                </v-card-title>
                <v-card-subtitle>
                    {{ this.classId }}
                </v-card-subtitle>
            </v-card-item>
            
            <!-- Class slot info -->
            <v-card-text>
                <p>
                    <v-icon icon="mdi-calendar" size="small"/>
                    {{ this.date }}
                </p>
                <p>
                    <v-icon icon="mdi-clock-outline" size="small"/>
                    {{ this.time }}
                </p>
            </v-card-text>
            <v-card-text class="text-caption">
                {{ this.message }}
            </v-card-text>

            <v-divider></v-divider>

            <!-- Confirm Buttons -->
            <v-card-text v-if="this.title != 'Booking Successful'">
                <v-row dense>
                    <v-col cols="12" md="6">
                        <v-btn block variant="outlined" :color="this.color" class="mb-5" @click="$emit('closeModal')">No</v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-btn block :color="this.color" class="mb-5" @click="$emit('actionModal')">Yes</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <!-- Successful Button -->
            <v-card-text v-else>
                <v-btn block :color="this.color" class="mb-5" @click="$emit('closeModalReload')">Ok</v-btn>
            </v-card-text>

        </v-card>
    </v-dialog>
</template>
    
<script>
export default {
    props: {
        value: Boolean,
        title: String,
        color: String,
        message: String,
        className: String,
        classId: String,
        date: String,
        time: String,
        icon: String,
    },
}
</script>
