<template>
    <v-chip v-if="status.toUpperCase() === 'INACTIVE' ||
        status.toUpperCase() === 'EXPIRED' ||
        status.toUpperCase() === 'PENDING PAYMENT' ||
        status.toUpperCase() === 'TERMINATED'
        " color="danger" prepend-icon="mdi-close" class="me-3"
        :size="this.mobile ? 'small' : 'default'">
        {{ status }}
    </v-chip>
    <v-chip v-else-if="status.toUpperCase() === 'ACTIVE'" color="primary" prepend-icon="mdi-check" class="me-3" :size="this.mobile ? 'small' : 'default'" >
        {{ status }}
    </v-chip>
    <v-chip v-else-if="status.toUpperCase() === 'PAUSED'" color="orange" prepend-icon="mdi-pause" class="me-3" :size="this.mobile ? 'small' : 'default'">
        {{ status }}
    </v-chip>
</template>

<script>
export default {
    props: {
        status: String,
        mobile: {
            type: Boolean,
        },
    }
}
</script>
