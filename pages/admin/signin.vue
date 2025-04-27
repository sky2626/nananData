<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-screen">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold text-white">Sign in to Admin account</h2>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleSignIn">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="email" type="email" id="email" autocomplete="email" required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
          </div>
          <div class="mt-2">
            <input v-model="password" type="password" id="password" autocomplete="current-password" required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600">
          </div>
        </div>

        <div class="mb-2">
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500">Sign
            in</button>
        </div>
      </form>

      <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-500">{{ errorMessage }}</p>
      <p v-if="successMessage" class="mt-2 text-center text-sm text-green-500">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { navigateTo } from "#app";
import { createClient } from '@supabase/supabase-js'


definePageMeta({
  layout: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/admin',
  }
})

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const handleSignIn = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  // Access the Supabase client via inject
const supabase = createClient('https://vnqfxfenckuajfrmhwkl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucWZ4ZmVuY2t1YWpmcm1od2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3MDMzMzgsImV4cCI6MjA2MTI3OTMzOH0.xAWgOU-ANOrMMqqR1pfL9qUfMiRS0ysjogHHg-d3Z1g')

if (!supabase) {
  throw new Error('Supabase client not found!')
}
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message || "Sign-in failed";
    } else {
      successMessage.value = "Sign-in successful! Redirecting...";
      // Save user session to local storage (or any other secure storage mechanism)
      localStorage.setItem("supabase_token", data?.session?.access_token);

      setTimeout(() => {
        navigateTo("/admin"); // Redirect to the Admin dashboard
      }, 1500);
    }
  } catch (error) {
    errorMessage.value = error.message || "Sign-in failed";
  }
};
</script>
