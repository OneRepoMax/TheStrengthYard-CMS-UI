<template>
    <v-card class="w-100" elevation="3">
        <v-card-title>Warm-Up Calculator</v-card-title>
        <v-card-text>
            Welcome to The Strength Yard's Warm-Up Calculator, a valuable tool to help you prepare for your strength
            training sessions. Proper warm-up sets are essential to prime your muscles and optimize your performance. Use
            this calculator to determine the ideal warm-up weights and reps based on your top set weight.
        </v-card-text>

        <v-card-item>
            <v-row>
                <v-col>
                    <v-text-field v-model="topSetWeight" label="Top Set Weight (kg)" type="number"></v-text-field>
                </v-col>
            </v-row>
            <v-btn @click="calculateWarmUps" color="black" block class="mb-3">Calculate Warm-Up Sets</v-btn>
            <v-btn @click="clearWarmUp" v-if="warmUpSets.length > 0" variant="outlined" block>Clear</v-btn>

            <v-card-title class="mt-5" v-if="warmUpSets.length > 0">5 sets warm up recommendation</v-card-title>

            <v-table v-if="warmUpSets.length > 0">
                <thead>
                    <tr>
                        <th>Reps</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="set in warmUpSets" :key="set.reps">
                        <td>
                            {{ set.reps }}
                        </td>
                        <td>
                            {{ set.weight }} kg
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <v-divider>
            </v-divider>

            <v-card-title class="mt-5" v-if="secondWarmUpSets.length > 0">4 sets warm up recommendation</v-card-title>

            <v-table v-if="secondWarmUpSets.length > 0">
                <thead>
                    <tr>
                        <th>Reps</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="set in secondWarmUpSets" :key="set.reps">
                        <td>
                            {{ set.reps }}
                        </td>
                        <td>
                            {{ set.weight }} kg
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <v-card-title class="mt-5" v-if="thirdWarmUpSets.length > 0">3 sets warm up recommendation</v-card-title>

            <v-table v-if="thirdWarmUpSets.length > 0">
                <thead>
                    <tr>
                        <th>Reps</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="set in thirdWarmUpSets" :key="set.reps">
                        <td>
                            {{ set.reps }}
                        </td>
                        <td>
                            {{ set.weight }} kg
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-item>
    </v-card>
</template>
  
<script>
export default {
    data() {
        return {
            topSetWeight: null,
            warmUpSets: [],
            secondWarmUpSets: [],
            thirdWarmUpSets: [],
        };
    },
    methods: {
        calculateWarmUps() {
            this.calculateWarmUp();
            this.calculateSecondWarmUp();
            this.calculateThirdWarmUp();
        },
        calculateWarmUp() {
            this.warmUpSets = []; // Clear previous warm-up results

            const topSet = parseFloat(this.topSetWeight);
            const warmUpSets = [];

            const formulas = [0.4, 0.55, 0.7, 0.8, 0.9];
            const reps = [5, 3, 1, 1, 1];

            for (let i = 0; i < formulas.length; i++) {
                let warmUpWeight = 0;

                if (i === 0 || i === 3 || i === 4) {
                    if (formulas[i] * topSet <= 22.5) {
                        warmUpWeight = "Bar";
                    } else {
                        warmUpWeight = Math.round(formulas[i] * topSet / 2.5) * 2.5;
                    }
                } else {
                    warmUpWeight = Math.round(formulas[i] * topSet / 2.5) * 2.5;
                }

                warmUpSets.push({ reps: reps[i], weight: warmUpWeight });
            }

            this.warmUpSets = warmUpSets;
        },
        calculateSecondWarmUp() {
            this.secondWarmUpSets = []; // Clear previous second warm-up results

            const topSet = parseFloat(this.topSetWeight);
            const secondWarmUpSets = [];

            const secondFormulas = [0.4, 0.6, 0.8, 0.9];
            const secondReps = ["4-5", "2-3", 1, 1];

            for (let i = 0; i < secondFormulas.length; i++) {
                let secondWarmUpWeight = 0;

                if (i === 0 || i === 1) {
                    if (secondFormulas[i] * topSet <= 22.5) {
                        secondWarmUpWeight = "Bar";
                    } else {
                        secondWarmUpWeight = Math.round(secondFormulas[i] * topSet / 2.5) * 2.5;
                    }
                } else {
                    secondWarmUpWeight = Math.round(secondFormulas[i] * topSet / 2.5) * 2.5;
                }

                secondWarmUpSets.push({ reps: secondReps[i], weight: secondWarmUpWeight });
            }

            this.secondWarmUpSets = secondWarmUpSets;
        },
        calculateThirdWarmUp() {
            this.thirdWarmUpSets = []; // Clear previous third warm-up results

            const topSet = parseFloat(this.topSetWeight);
            const thirdWarmUpSets = [];

            const thirdFormulas = [0.5, 0.76, 0.87];
            const thirdReps = ["4-5", "2-3", 1];

            for (let i = 0; i < thirdFormulas.length; i++) {
                let thirdWarmUpWeight = 0;

                if (i === 0 || i === 1) {
                    if (thirdFormulas[i] * topSet <= 22.5) {
                        thirdWarmUpWeight = "Bar";
                    } else {
                        thirdWarmUpWeight = Math.round(thirdFormulas[i] * topSet / 2.5) * 2.5;
                    }
                } else {
                    thirdWarmUpWeight = Math.round(thirdFormulas[i] * topSet / 2.5) * 2.5;
                }

                thirdWarmUpSets.push({ reps: thirdReps[i], weight: thirdWarmUpWeight });
            }

            this.thirdWarmUpSets = thirdWarmUpSets;
        },
        clearWarmUp() {
            this.topSetWeight = null;
            this.warmUpSets = [];
            this.secondWarmUpSets = [];
        },
    },
};
</script>
  