<template>
    <v-main>
        <v-container justify="center" class="h-100" align="center">
            <v-col cols="12" md="6">
                <v-stepper :items="['Registration', 'Feedback', 'Indemnity', 'Gym Rules']">
                <template v-slot:item.1>
                    <RegisterForm />
                </template>

                <template v-slot:item.2>
                    <FeedbackForm />
                </template>

                <template v-slot:item.3>
                    <IndemnityForm />
                </template>

                <template v-slot:item.4>
                    <GymRulesForm />
                </template>

                </v-stepper>
            </v-col>
        </v-container>
    </v-main>
</template>

<script setup>

import RegisterForm from '@/components/RegisterForm.vue'
import FeedbackForm from '@/components/FeedbackForm.vue'
import IndemnityForm from '@/components/IndemnityForm.vue'
import MembershipForm from '@/components/MembershipForm.vue'
import GymRulesForm from '@/components/GymRulesForm.vue'

import { VStepper } from 'vuetify/labs/VStepper'

</script>

<style lang="scss" scoped>

</style>