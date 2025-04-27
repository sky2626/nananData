// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      paystackPublicKey: 'pk_test_eb3bc9ba87ba3fe7f19a2fe09d4a7132ea9d37b2',
    }
  },
  css: ['~/assets/css/main.css'],
  
  modules: ['@nuxt/ui'],
})
