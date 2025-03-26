<template>
  <div class="relative flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black">
    <!-- Glowing Background Effect -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 blur-3xl"></div>

    <!-- Illustration -->
    <div class="w-80 md:w-96 mb-6 relative z-10">
      <img src="@/assets/404.png" alt="404 Not Found" class="w-full">
    </div>

    <!-- Text Content -->
    <h1 class="text-8xl font-extrabold text-white drop-shadow-lg">404</h1>
    <p class="text-xl text-gray-300 mt-4">
      Oops! The page you're looking for doesn't exist.
    </p>
    <p class="text-md text-gray-400 mt-2">
      It might have been moved or deleted.
    </p>

    <!-- Home Button -->
    <router-link to="/" class="mt-8 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 
              text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out relative z-10">
      Go Home
    </router-link>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>