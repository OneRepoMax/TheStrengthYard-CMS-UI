<template>
    <v-card elevation="3" class="pa-5 text-start mb-3">
        <v-card-text class="mb-3">
            <v-row>
                <v-col cols="3">
                    <v-img src="@/assets/the-strength-yard-logo-main.svg" class="orgIcon"></v-img>
                </v-col>
                <v-col class="pa-0">
                    <v-card-title>The Strength Yard</v-card-title>
                    <v-card-subtitle class="pa-0">
                        <v-list-item>
                            369 Joo Chiat Road <br>
                            Singapore 427614
                        </v-list-item>
                    </v-card-subtitle>
                </v-col>
            </v-row>
        </v-card-text>

        <v-divider class="mb-3"></v-divider>

        <v-list-item>
            <v-icon title="support@thestrengthyard.com" size="x-small" class="me-3">mdi-email</v-icon>support@thestrengthyard.com
        </v-list-item>
        <v-list-item>
            <v-icon title="+6569097449" size="x-small" class="me-3">mdi-phone</v-icon>+6569097449
        </v-list-item>
        <v-list-item>
            <v-icon title="+6569097449" size="x-small" class="me-3">mdi-clock</v-icon>Mon to  6AM – 12MN
        </v-list-item>
        
    </v-card>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.orgIcon {
    max-height: 80px;
}
</style>