<template>
  <div class="mt-24 p-6 max-w-6xl mx-auto">
    <div class="flex justify-between mb-6">
      <button @click="logout" class="px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
      <button @click="exportToCSV" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Export CSV
      </button>
    </div>

    <h1 class="text-3xl font-bold mb-4">Payment Records</h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6">
      <input v-model="search" type="text" placeholder="Search phone or reference"
        class="p-2 border rounded w-full sm:w-auto" />
      <select v-model="status" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <div class="flex gap-2">
        <button v-for="option in filterOptions" :key="option.value" @click="applyFilter(option.value)"
          :class="['px-4 py-2 rounded-lg', selectedFilter === option.value ? 'bg-gray-800 text-white' : 'bg-gray-300 hover:bg-gray-400']">
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Loading & Error -->
    <div v-if="loading" class="text-center text-gray-500">Loading payments...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <!-- Payments Table -->
    <table v-else class="w-full bg-white shadow rounded-lg overflow-hidden">
      <thead class="bg-gray-900 text-white">
        <tr>
          <th class="p-3">#</th>
          <th class="p-3">Phone</th>
          <th class="p-3">Reference</th>
          <th class="p-3">Size (GB)</th>
          <th class="p-3">Amount (GHS)</th>
          <th class="p-3">Status</th>
          <th class="p-3">Date</th>
          <th class="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(payment, index) in filteredPayments" :key="payment.id" class="odd:bg-gray-100">
          <td class="p-3">{{ index + 1 }}</td>
          <td class="p-3">{{ payment.phone }}</td>
          <td class="p-3">{{ payment.reference }}</td>
          <td class="p-3">{{ payment.size || 'N/A' }}</td>
          <td class="p-3">GH₵{{ payment.amount.toFixed(2) }}</td>
          <td class="p-3">
            <span :class="statusClass(payment.status)">
              {{ payment.status }}
            </span>
          </td>
          <td class="p-3">{{ formatDate(payment.created_at) }}</td>
          <td class="p-3 flex gap-2">
            <button @click="viewDetails(payment)" class="text-blue-600 hover:underline">Details</button>
            <button @click="deletePayment(payment.id)" class="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'

definePageMeta({
  layout: "admin",
  middleware: 'auth'
})

// Supabase client
const { $supabase } = useNuxtApp()

const payments = ref([])
const loading = ref(true)
const error = ref(null)
const search = ref('')
const status = ref('')
const selectedFilter = ref('all')

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Today", value: "day" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" }
]

const fetchPayments = async () => {
  loading.value = true
  try {
    const { data, error: fetchError } = await $supabase
      .from('payments') // your table name
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) throw fetchError
    payments.value = data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const applyFilter = (filter) => {
  selectedFilter.value = filter
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/admin/signin')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const statusClass = (status) => {
  return status === 'completed' ? 'text-green-600 font-bold' : 'text-yellow-600 font-bold'
}

const exportToCSV = async () => {
  if (!payments.value.length) {
    alert("No data to export.")
    return
  }

  const csvContent = [
    ["ID", "Phone", "Reference", "Size", "Amount", "Status", "Created At"],
    ...payments.value.map(payment => [
      payment.id,
      payment.phone,
      payment.reference,
      payment.size,
      payment.amount,
      payment.status,
      formatDate(payment.created_at)
    ])
  ].map(row => row.join(",")).join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const { saveAs } = await import('file-saver')
  saveAs(blob, 'payments.csv')
}

// Date Filters
const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString()
const isSameWeek = (d1, d2) => {
  const oneJan = new Date(d2.getFullYear(), 0, 1)
  const numberOfDays = Math.floor((d2 - oneJan) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil((d2.getDay() + 1 + numberOfDays) / 7)
  const paymentNumberOfDays = Math.floor((d1 - oneJan) / (24 * 60 * 60 * 1000))
  const paymentWeekNumber = Math.ceil((d1.getDay() + 1 + paymentNumberOfDays) / 7)
  return weekNumber === paymentWeekNumber
}
const isSameMonth = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth()

const filteredPayments = computed(() => {
  const now = new Date()
  return payments.value.filter(payment => {
    const paymentDate = new Date(payment.created_at)
    const matchesSearch = !search.value || payment.phone.includes(search.value) || payment.reference.includes(search.value)
    const matchesStatus = !status.value || payment.status === status.value

    let matchesDate = true
    if (selectedFilter.value === 'day') matchesDate = isSameDay(paymentDate, now)
    if (selectedFilter.value === 'week') matchesDate = isSameWeek(paymentDate, now)
    if (selectedFilter.value === 'month') matchesDate = isSameMonth(paymentDate, now)

    return matchesSearch && matchesStatus && matchesDate
  })
})

// Delete a payment
const deletePayment = async (paymentId) => {
  if (!confirm("Are you sure you want to delete this payment?")) return

  const { error: deleteError } = await $supabase
    .from('payments')
    .delete()
    .eq('id', paymentId)

  if (deleteError) {
    alert("Error deleting payment: " + deleteError.message)
  } else {
    payments.value = payments.value.filter(p => p.id !== paymentId)
    alert("Payment deleted successfully.")
  }
}

// View details (example alert for now)
const viewDetails = (payment) => {
  alert(`Payment Details\nPhone: ${payment.phone}\nReference: ${payment.reference}\nAmount: GH₵${payment.amount}`)
}

const router = useRouter()

onMounted(fetchPayments)
</script>
