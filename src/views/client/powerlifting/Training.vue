<template>
    <v-row style="max-width: 1280px" class="mx-auto">
        <v-col>
            <v-card class="mb-3">
                <v-img src="../../../assets/purchaseMembershipBanner.png" height="300px" cover />
                <v-card-title>Powerlifting Training Tools</v-card-title>
                <v-card-text>Welcome to The Strength Yard's Powerlifting Training Tool, the ultimate tool for powerlifters and
                    strength enthusiasts. Determining your one-rep max (1RM) and warm ups is essential for tracking your progress and
                    planning your training. Whether you're a seasoned lifter or just starting out, our calculator simplifies
                    the process and provides you with valuable insights.</v-card-text>
                <v-card-title>
                    Why use our tools?
                </v-card-title>
                <v-card-text>
                    Understanding your optimal performance is crucial for designing effective training programs. It helps you set realistic
                    goals and tailor your workouts to achieve optimal results. Whether you're focused on squat, bench press,
                    or deadlift, knowing your optimal performance allows you to:
                    <v-list lines="one">
                        <v-list-item>
                            <v-list-item-content>
                                Set achievable lifting targets.
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>

                                Determine the appropriate weights for your sets and reps.
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            Evaluate your strength gains over time.
                        </v-list-item>
                        <v-list-item>
                            Prevent overtraining or injury by managing your training intensity.
                        </v-list-item>


                    </v-list>

                </v-card-text>
            </v-card>
            <OneRepMaxCalculator />
            <WarmUpCalculator />
        </v-col>
    </v-row>
</template>

<script>
import OneRepMaxCalculator from '@/components/powerlifting/OneRepMaxCalculator.vue';
import WarmUpCalculator from '@/components/powerlifting/WarmUpCalculator.vue';
import { useUserStore } from '@/store/user'
import { useMembershipStore } from '@/store/membership'

export default {
    setup() {
        const userStore = useUserStore()
        const membershipStore = useMembershipStore()

        return {
            userStore,
            membershipStore,
        }

    },
    components: {
        OneRepMaxCalculator,
        WarmUpCalculator
    },
    data() {
        return {
            loading: false,
            membershipRecord: []
        }
    },

    methods: {

    }
}
</script>

<style lang="scss" scoped></style>