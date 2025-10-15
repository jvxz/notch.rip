import Konva from 'vue-konva'

export default defineNuxtPlugin({
  setup: (app) => {
    app.vueApp.use(Konva)
  },
})
