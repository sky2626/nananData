<template>
  <div class="pt-18">
    <div class="relative ">
      <div
        class="h-[400px] mt-34 max-w-7xl mx-2 md:mx-auto rounded-[65px] absolute top-[-200px] inset-0 bg-[url('/tel.png')] bg-cover">
        <div class="flex justify-between items-center p-8">
          <IconsMtn class="text-yellow-800 text-2xl" />
          <h2 class="text-2xl text-black font-semibold">Telecel Data</h2>
          <NuxtLink to="/" class="text-black font-semibold px-6 hover:text-gray-800">
            New Product
          </NuxtLink>
        </div>
      </div>

      <div class="max-w-5xl mx-2 md:mx-auto mt-34 p-6 shadow-lg rounded-[60px] bg-gray-300/10 backdrop-blur-lg ">
        <div class="w-full flex flex-col md:flex-row justify-center gap-4 py-8">
          <div class="w-full">
            <h1 class="text-2xl font-bold text-gray-800">Telecel DATA</h1>
            <p class="text-gray-600 mt-2">Telecel non-expiry data available</p>
          </div>

          <div class="border-y-3 border-[#E40001] rounded-full w-full h-full p-4">
            <img src="/tel.jpeg" alt="mtn" class="w-full object-cover rounded-full border border-gray-300/10" />
          </div>

          <div class="w-full">
            <h2 class="text-lg font-semibold mb-4 text-black">Available Bundle</h2>
            <div class="gap-2 grid grid-cols-3 md:grid-cols-4">
              <div v-for="(price, size) in sizes" :key="size" class="flex flex-col">
                <div @click="togglePrice(size, price)"
                  class="bg-gray-300/10 backdrop-blur-lg shadow-sm text-black font-semibold px-2 py-2 rounded-xl hover:bg-[#E40001]">
                  {{ size }} GB
                </div>
              </div>
            </div>
            <div>
              <h2 class="mt-4 text-lg font-semibold text-black">Selected Price:</h2>
              <p class="text-gray-800 mt-1">
                {{ selectedPrice ? `GH₵${selectedPrice}` : 'Select a size to see the price' }}
              </p>
            </div>
            <div class="mt-4">
              <label for="phone" aria-required="true" class="text-black">Recipient Number</label>
              <input v-model="phoneNumber" type="tel"
                class="border border-black rounded-xl p-2 w-full text-black focus:ring-[#E40001] focus:border-[#E40001]"
                id="phone" name="phone" placeholder="Recipient Number" required>
            </div>


            <!-- Paystack Payment Button -->
            <div class="mt-4">
              <button @click="payWithPaystack"
                class="bg-black text-[#E40001] px-6 py-2 rounded-xl text-lg hover:bg-gray-800 couser-pointer">
                Pay Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="mx-2 md:mx-auto mt-8 max-w-7xl">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Related Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.name"
          class="bg-white shadow-lg p-4 rounded-2xl transform hover:scale-105 transition-all duration-300 ease-in-out">
          <div class="relative">
            <img :src="product.image" alt="product.name"
              class="w-full h-48 object-cover rounded-xl border border-gray-200">
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
import { createClient } from '@supabase/supabase-js'

const sizes = ref({
  5: 25.5, 10: 46, 15: 66.5, 20: 87.5, 25: 112, 30: 131, 50: 215, 100: 389
});
const selectedPrice = ref(null);
const phoneNumber = ref("");
const config = useRuntimeConfig();

const publicKey = config.public.paystackPublicKey; // Use the public key from Nuxt config

const togglePrice = (size, price) => {
  selectedPrice.value = selectedPrice.value === price ? null : price;
  console.log(`Selected size: ${size} GB, Price: GH₵${price}`);
};

// Function to load Paystack script
const loadPaystack = () => {
  if (!window.PaystackPop) {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => console.log("✅ Paystack script loaded successfully.");
    script.onerror = () => console.error("❌ Failed to load Paystack script.");
    document.body.appendChild(script);
  }
};

// Separate async function to save payment to Supabase
// Separate async function to save payment to Supabase
const savePayment = async (response) => {
  try {
    const supabase = createClient('https://aycuhibappzsgryiqztm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5Y3VoaWJhcHB6c2dyeWlxenRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTc5MzksImV4cCI6MjA2MTYzMzkzOX0.UzxTQwAHF3MLzlisp0cOK9eXRciIklohlQdkuNb9pPU');

    // Ensure that supabase client is initialized properly
    if (!supabase) {
      throw new Error('Supabase client not found!');
    }

    // Check size value before inserting
    const sizeValue = Number(Object.keys(sizes.value).find((key) => sizes.value[key] === selectedPrice.value));
    if (isNaN(sizeValue)) {
      throw new Error('Invalid size value. Cannot find a valid size.');
    }

    // Insert the payment record into the Supabase table
    const { data, error } = await supabase
      .from('payment')
      .insert([
        {
          phone: phoneNumber.value,
          reference: response.reference,
          bundletype: "telecel",
          size: sizeValue,
          amount: selectedPrice.value,
          status: response.status,
        }
      ]);

    // Log error details if any
    if (error) {
      console.error("❌ Error inserting payment record into Supabase", error.message || error.details || error);
    } else {
      console.log("✅ Payment record added to Supabase:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected error while saving payment:", err);
  }
};

// Function to initiate payment
const payWithPaystack = () => {
  if (!selectedPrice.value || !phoneNumber.value) {
    alert("Please select a data plan and enter your phone number.");
    return;
  }

  if (!window.PaystackPop) {
    alert("Paystack script is not loaded yet. Please try again.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: `${phoneNumber.value}@example.com`, // Use phone number as email
    amount: selectedPrice.value * 100, // Paystack expects amount in kobo
    currency: "GHS",
    callback: function (response) {
      //alert("✅ Payment Successful! Ref: " + response.reference);
      savePayment(response); // Call async function separately
    },
    onClose: function () {
      alert("❌ Payment window closed.");
    },
  });

  handler.openIframe();
};

// Load Paystack script on page mount
onMounted(() => {
  loadPaystack();
});

</script>
