<template>
        <v-switch
            hide-details
            inset
            :label="`Switch to ${theme.global.name.value.toString()}`"
            @click="toggleTheme">
        </v-switch>
</template>

<script>

import { useTheme } from 'vuetify'

export default {
  setup () {
    const theme = useTheme()

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  },
}

</script>
