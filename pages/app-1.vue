<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Payments</h1>

    <div v-if="loading" class="text-gray-500">Loading payments...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error }}</div>

    <table v-else class="min-w-full bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">Phone</th>
          <th class="px-4 py-2 text-left">Reference</th>
          <th class="px-4 py-2 text-left">Amount</th>
          <th class="px-4 py-2 text-left">Status</th>
          <th class="px-4 py-2 text-left">Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in payments" :key="payment.id" class="border-t">
          <td class="px-4 py-2">{{ payment.phone }}</td>
          <td class="px-4 py-2">{{ payment.reference }}</td>
          <td class="px-4 py-2">{{ payment.amount }}</td>
          <td class="px-4 py-2">{{ payment.status }}</td>
          <td class="px-4 py-2">{{ formatDate(payment.created_at) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
// Access the Supabase client via inject
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://vnqfxfenckuajfrmhwkl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucWZ4ZmVuY2t1YWpmcm1od2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MDMzMzgsImV4cCI6MjA2MTI3OTMzOH0.xAWgOU-ANOrMMqqR1pfL9qUfMiRS0ysjogHHg-d3Z1g')

if (!supabase) {
  throw new Error('Supabase client not found!')
}
// State
const payments = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fetch the data from Supabase on mounted
onMounted(async () => {
  if (!supabase) {
    error.value = 'Supabase client is not available.'
    loading.value = false
    return
  }

  const { data, error: fetchError } = await supabase
    .from('payment')
    .select('*')
    .order('created_at', { ascending: false })

  if (fetchError) {
    error.value = fetchError.message
  } else {
    payments.value = data || []
  }

  loading.value = false
})

// Format Date for better readability
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}
</script>
