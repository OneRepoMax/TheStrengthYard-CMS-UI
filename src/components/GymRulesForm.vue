<template>
      <v-form class="text-left">
      <!-- Gym Layout Image-->
      <v-container>
        <h3>Gym Layout</h3>
        <img style="max-width: 100%;" src="/src/assets/gym-layout.jpg" />
      </v-container>
      <!-- Equipment Care -->
      <v-container >
        <h3>Equipment Care</h3>
        <p>Please refrain from excessive slamming or throwing of equipment.</p><br>
        <p>
          Dropping of weights during Deadlifts or Olympic Weightlifting Movements such as Clean and Jerks and Snatches are fine only on the designated raised platforms
          (<span style="font-weight: bold;">Indicated as the Weight's Dropping Area in the picture above</span>).
        </p><br>
        <p>Please do not drop the weights anywhere else.</p><br>
        <p>
          In addition, please do not dump the barbell when squatting. Please use the spotting bars and lower the weight back down onto it if you're gonna fail.
        </p><br>
        <p>
          Equipment will get damaged or spoil if you dump it. Get a spotter to assist you when attempting heavy.
        </p>
      </v-container>

      <!-- Aircon and Lights -->
      <v-container >
        <h3>Aircon and Lights</h3>
        <p>
          If you're the first to arrive the gym or the last to leave the gym (regardless of timing, as long as there's no one else around), 
          <span style="font-weight: bold;">please turn on/off the lights and aircon</span>.
        </p><br>
        <p>The light switches are indicate with a small yellow sticker and the aircon remote is near to the second glass door at the back.</p>
      </v-container>

      <!-- Music -->
      <v-container >
        <h3>Music</h3>
        <p>
          The music 
          <span style="font-weight: bold;">will auto on and off by itself</span>,
          so you need not turn it on or off if you're the first or last to arrive/leave the gym.
        </p><br>
        <p><span style="font-weight: bold;">If there's no music in the gym, feel free to reach out to us.</span></p>
      </v-container>

      <!-- Barbell Safety -->
      <v-container >
        <h3>Barbell Safety</h3>
        <p>
          If you do not have a spotter to assist you while performing a bench press, 
          <span style="font-weight: bold;">please attach the spotting bars onto the rig</span>
          so that you would not get pinned down by the barbell if you were to fail the lift.
        </p><br>
        <p><span style="font-weight: bold;">Do use the spotting bars as well</span>
        if there's no one around to spot you when you're training other barbell movements.
        </p>
      </v-container>

      <!-- Placing Back Of Used Equipment -->
      <v-container >
        <h3>Placing Back Of Used Equipment</h3>
        <p>
          <span style="font-weight: bold;">Please place back all used equipment to their original position</span>
          so that the gym will remain as a safe environment for everyone to train.
        </p>
      </v-container>

      <!-- Chalk Usage -->
      <v-container >
        <h3>Chalk Usage</h3>
        <p>
          Due to Covid-19, the gym doesn't provide a communal chalk bucket for sharing. If you would need to use, 
          <span style="font-weight: bold;">please bring your own chalk and chalk up at the back area instead</span>
          as there are HEPA air filters installed in the gym.
        </p><br>
        <p>Do use the gym's brush to brush away the chalk after training.
        </p>
      </v-container>

      <!-- Hygiene -->
      <v-container >
        <h3>Hygiene</h3>
        <p>Please bring your own towel.
        </p>
      </v-container>

      <!-- Booking System -->
      <v-container >
        <h3>Booking System</h3>
        <p>The booking system now mainly serves to inform members of the slots that are blocked off for classes or events.
        </p><br>
        <p>There will be times where the gym's actual capacity doesn't accurately reflect what's shown in the system (specifically during peak hours such as weekday evenings and weekend afternoons).
        </p><br>
        <p>We are more lenient now for members who do not book a slot to train.
        </p><br>
        <p>However if it does get too crowded, we will start to filter out the crowd and members who have booked a slot will be prioritize.
        </p>
      </v-container>

      <!-- Acknowledgement -->
      <v-container >
        <h3>Acknowledgement</h3>
        <v-checkbox
          v-model="userStore.AcknowledgementTnC"
          label-class="label"
          hide-details
          class="my-3"
        >
          <template v-slot:label>
            <span class="text-left">
              By Clicking The Checkbox, I Acknowledge That I Have Read And Accept The Terms And Conditions From This Link:
              <a href="https://www.thestrengthyard.com/terms-conditions-strength-conditioning-gym-singapore/" target="_blank">https://www.thestrengthyard.com/terms-conditions-strength-conditioning-gym-singapore/.</a>
              I Also Acknowledge That I Use The Facility Or Service At My Own Risk And That The Strength Yard Shall Not Be Liable For Any Loss Or Damage To Personal Property Or Death Or Personal Injury, From My Use Of The Facility Or Service.
            </span>
          </template>
        </v-checkbox>
        <v-checkbox v-model="userStore.AcknowledgementOpenGymRules" label="By Clicking The Checkbox, I Acknowledge That I Have Read And Will Follow The Rules."></v-checkbox>
      </v-container>

      </v-form>
</template>

<script>
import { useUserStore } from '@/store/user'

export default {
    setup() {
      const userStore = useUserStore()

      return {
          userStore
      }
    },
  data() {
    return {
      rulesAcknowledgement: '',
    };
  },

};
</script>
