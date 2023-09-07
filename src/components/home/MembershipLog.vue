<template>
    <v-card elevation="3" class="pa-3">
        <v-card-actions>
            <v-card-title>
                <v-icon prepend-icon class="me-2">mdi-text-account</v-icon>
                Membership Activty
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
        </v-card-actions>
        <v-expand-transition>

        </v-expand-transition>
        <div v-show="show">
            <v-card-text>
                <v-timeline density="compact" align="start">
                    <v-timeline-item v-for="message in messages" :key="message.time" :dot-color="message.color"
                        size="x-small">
                        <div class="mb-4">
                            <div class="font-weight-normal">
                                <strong>{{ message.from }}</strong> @{{ message.time }}
                            </div>
                            <div>{{ message.message }}</div>
                        </div>
                    </v-timeline-item>
                </v-timeline>

            </v-card-text>
        </div>

    </v-card>
</template>

<script>

export default {
    props:{
        membershipLog: Array
    },
    data: () => ({
        show: true,
        messages: [
            {
                from: 'Membership Resumed',
                message: `Open Gym Membership`,
                time: '17/8/2023',
                color: 'deep-purple-lighten-1',
            },
            {
                from: 'Membership Paused',
                message: 'Open Gym Membership',
                time: '13/5/2023',
                color: 'green',
            },
            {
                from: 'Membership Started',
                message: 'Open Gym Membership',
                time: '21/2/2022',
                color: 'deep-purple-lighten-1',
            },
        ],
    }),
}

</script>

<style lang="scss" scoped></style>