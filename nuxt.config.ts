// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      paystackPublicKey: 'sk_live_881c2291e11eb4d4789dde5dce54ed2e8ea9f900',
    }
  },
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'BisaData',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { id: 'description', name: 'description', content: 'this is logistics compay in Ghana. Marketing and Procurement Services. Marketing and supplies of General goods and services. We also help in sourcing of general goods domestically and Internationally.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/bisadatagh.svg' },
      ],
    },
  },
  modules: ['@nuxt/ui'],
})
