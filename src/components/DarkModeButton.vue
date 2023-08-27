<template>
    <v-btn
        variant="outlined"
        @click="toggleTheme"
        block
        prepend-icon="mdi-theme-light-dark">
        Switch theme 
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