<template>
    <v-main>
        <v-container fluid max-width="800px" class="d-flex flex-wrap justify-center align-center">
            <v-card>
                <v-img src="@/assets/BookingBanner.jpg" max-height="250px" cover></v-img>
                <div class="pa-5">
                    <v-card-title>Book A Class</v-card-title>
                    <v-card-text>
                        Here’s Our Gym Classes For Those Who Enjoy The Camaraderie Of Training In A Group While Getting
                        Functionally Stronger!
                    </v-card-text>

                    <v-divider/>

                    <ViewClassSlots />

                </div>
            </v-card>
        </v-container>
    </v-main>
</template>

<script>
import ViewClassSlots from "@/components/book/ViewClassSlots.vue";

export default {
    components: {
        ViewClassSlots,
    },
}
</script>

<style lang="scss" scoped>

</style>