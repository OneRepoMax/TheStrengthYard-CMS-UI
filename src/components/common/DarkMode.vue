<template>
    <v-btn
        hide-details
        inset
        :label="`Switch to ${theme.global.name.value.toString()}`"
        @click="toggleTheme"
        icon="mdi-theme-light-dark">
    </v-btn>
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
