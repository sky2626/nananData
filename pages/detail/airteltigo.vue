<template>
  <div class="pt-18">
    <!-- Hero Section -->
    <div class="relative">
      <div
        class="h-[400px] mt-34 max-w-7xl mx-2 md:mx-auto rounded-[65px] absolute top-[-200px] inset-0 bg-[url('/at.png')] bg-cover bg-center">
        <div class="flex justify-between items-center p-8">
          <IconsMtn class="text-yellow-800 text-2xl" />
          <h2 class="text-2xl text-black font-semibold">AirtelTigo Big Data</h2>
          <NuxtLink to="/" class="text-black font-semibold px-6 hover:text-gray-800 transition">
            New Product
          </NuxtLink>
        </div>
      </div>

      <!-- Main Card -->
      <div class="max-w-5xl mx-2 md:mx-auto mt-34 p-6 shadow-lg rounded-[60px] bg-gray-300/10 backdrop-blur-lg">
        <div class="flex flex-col md:flex-row gap-8 py-8">
          <!-- Left Info -->
          <div class="w-full">
            <h1 class="text-2xl font-bold text-gray-800">AirtelTigo Big DATA</h1>
            <p class="text-gray-600 mt-2">AirtelTigo Big data non-expiry bundles available.</p>
          </div>

          <!-- Center Image -->
          <div class="w-full flex justify-center items-center">
            <img src="/atlogo.png" alt="AirtelTigo Logo"
              class="w-48 h-48 object-cover rounded-full border border-gray-300 p-2" />
          </div>

          <!-- Right Info -->
          <div class="w-full">
            <h2 class="text-lg font-semibold mb-4 text-black">Available Bundles</h2>
            <div class="grid grid-cols-3 md:grid-cols-4 gap-2">
              <div v-for="(price, size) in sizes" :key="size" @click="togglePrice(size, price)"
                class="cursor-pointer bg-gray-300/10 backdrop-blur-lg shadow-sm text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#E40001] transition text-center">
                {{ size }} GB
              </div>
            </div>

            <!-- Selected Price -->
            <div class="mt-4">
              <h2 class="text-lg font-semibold text-black">Selected Price:</h2>
              <p class="text-black mt-1">
                {{ selectedPrice ? `GH₵${selectedPrice}` : 'Select a bundle to see price' }}
              </p>
            </div>

            <!-- Phone Input -->
            <div class="mt-4">
              <label for="phone" class="text-black font-semibold">Recipient Number</label>
              <input v-model="phoneNumber" type="tel" id="phone" name="phone"
                class="border border-black rounded-xl p-2 w-full focus:ring-[#E40001] focus:border-[#E40001] mt-2"
                placeholder="Enter recipient number" required />
            </div>

            <!-- Pay Now Button -->
            <div class="mt-6">
              <button @click="payWithPaystack"
                class="bg-black text-[#E40001] px-6 py-2 rounded-xl text-lg hover:bg-gray-800 transition">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="mx-2 md:mx-auto mt-16 max-w-7xl">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Related Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div v-for="product in products" :key="product.name"
          class="bg-white shadow-lg p-4 rounded-2xl hover:scale-105 transition-all duration-300 ease-in-out">
          <div class="relative">
            <img :src="product.image" :alt="product.name"
              class="w-full h-48 object-cover rounded-xl border border-gray-200" />
            <span v-if="product.sale"
              class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </span>
          </div>
          <div class="text-start mt-3">
            <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
            <p class="text-gray-500 text-sm">{{ product.category }}</p>
            <p class="text-xl font-bold text-yellow-600 mt-2">GH₵{{ product.price }}</p>
            <div class="mt-4">
              <NuxtLink to="#"
                class="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 hover:text-white transition">
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const sizes = ref({
  20: 79,
  25: 89,
  30: 100,
  40: 125,
  50: 145,
  100: 205,
  200: 358
});

const selectedPrice = ref(null);
const phoneNumber = ref("");
const publicKey = "pk_test_eb3bc9ba87ba3fe7f19a2fe09d4a7132ea9d37b2"; // Your Paystack Public Key

const togglePrice = (size, price) => {
  selectedPrice.value = selectedPrice.value === price ? null : price;
};

// Load Paystack script
const loadPaystack = () => {
  if (!window.PaystackPop) {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => console.log("✅ Paystack script loaded.");
    document.body.appendChild(script);
  }
};

// Payment function
const payWithPaystack = () => {
  if (!selectedPrice.value || !phoneNumber.value) {
    alert("❗ Please select a bundle and enter your phone number.");
    return;
  }

  if (!window.PaystackPop) {
    alert("❗ Paystack script not ready. Try again in a few seconds.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: `${phoneNumber.value}@example.com`,
    amount: selectedPrice.value * 100,
    currency: "GHS",
    callback: function (response) {
      alert("✅ Payment Successful! Ref: " + response.reference);

      // Submit payment info to backend
      useFetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          phone: phoneNumber.value,
          reference: response.reference,
          bundletype: "at",
          size: Number(Object.keys(sizes.value).find((key) => sizes.value[key] === selectedPrice.value)),
          amount: selectedPrice.value,
          status: response.status,
        },
      });
    },
    onClose: function () {
      alert("❌ Payment cancelled.");
    },
  });

  handler.openIframe();
};

onMounted(() => {
  loadPaystack();
});
</script>
