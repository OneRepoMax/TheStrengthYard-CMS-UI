<template>
    <v-card class="w-100 mb-3" elevation="3">
        
        <v-card-title>One Rep Max Calculator</v-card-title>

        <v-card-item>
            <v-row>
                <v-col cols="6">
                    <v-text-field v-model="weight" label="Weight (kg)" type="number"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="reps" label="Reps" type="number"></v-text-field>
                </v-col>
            </v-row>
            <v-btn @click="calculate1RM" color="black" block class="mb-3">Calculate 1 Rep Max</v-btn>
            <v-btn @click="clear1RM" v-if="oneRepMaxResults.length>0" variant="outlined" block>Clear </v-btn>

            <v-table v-if="oneRepMaxResults.length>0">
                <thead>
                    <tr>
                        <th>Percentage of 1RM</th>
                        <th>Weight</th>
                        <th>Repetitions of 1RM</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="result in percentageResults" :key="result.percentage">
                        <td>
                            {{ result.percentage }}%
                        </td>
                        <td>
                            {{ result.weight.toFixed(1) }} kg
                        </td>
                        <td>
                            {{ result.repetitions }}
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
            weight: null, // Sample weight
            reps: null,     // Sample reps
            oneRepMaxResults: [], // Store 1RM results
            percentageResults: [] // Store percentage results
        };
    },
    methods: {
        calculate1RM() {
            this.oneRepMaxResults = []; // Clear previous 1RM results
            for (let i = this.reps; i <= 15; i++) {
                const weight = this.weight / (1.0278 - 0.0278 * i);
                this.oneRepMaxResults.push({ reps: i, weight: weight });
            }

            this.calculatePercentage();
        },
        calculatePercentage() {
            // Modify the code so that it pushes repitition order in order
            this.percentageResults = []; // Clear previous percentage results
            const repetitionOrder = [1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 30];
            for (let i = 100, j = 0; i >= 50; i -= 5, j++) {
                const percentage = i;
                const weight = (percentage / 100) * this.oneRepMaxResults[0].weight;
                const repetitions = repetitionOrder[j];
                this.percentageResults.push({ percentage, weight, repetitions });
            }
        },
        clear1RM() {
            this.oneRepMaxResults = [];
            this.percentageResults = [];
        }
    }
};
</script>
  