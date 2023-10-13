<template>
    <v-dialog max-width="400px" @input="$emit('input', $event)">
        <v-card :title="this.title">
            <template v-slot:append>
                <v-btn icon="$close" variant="text" @click="$emit('closeModal')"></v-btn>
            </template>
            <v-divider></v-divider>
            <v-card-item>
                <v-card-title class="text-wrap">
                    {{ this.className }}
                </v-card-title>
                <v-card-subtitle>
                    {{ this.classId }}
                </v-card-subtitle>
            </v-card-item>
            <v-card-text>
                <p>
                    <v-icon icon="mdi-calendar" size="small"/>
                    {{ this.date }}
                    <!-- {{formattedDate(slot.StartTime)}} -->
                </p>
                <p>
                    <v-icon icon="mdi-clock-outline" size="small"/>
                    {{ this.time }}
                    <!-- {{formattedTime(slot.StartTime)}} - {{formattedTime(slot.EndTime)}} ({{slot.Duration}} Minutes) -->
                </p>
                <!-- <p>
                    <v-icon icon="mdi-account-multiple" size="small"/>
                    {{slot.CurrentCapacity}}/{{slot.Class.MaximumCapacity}} joined
                </p> -->
            </v-card-text>
            <v-card-text class="text-caption">
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
        color: String,
        message: String,
        className: String,
        classId: String,
        date: String,
        time: String,
    },
}
</script>
