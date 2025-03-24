<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <h2>📩 Verify Your Email</h2>
        <p>We've sent a verification link to your email.</p>
        <p>Please check your inbox and click the link to verify your account.</p>
        <p>If you don’t see the email, check your spam folder or request a new link.</p>
        <p class="support-text">Need help? <a href="/contact-support">Contact Support</a></p>
        <!-- <button @click="closeModal">OK</button> -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showModal: true, // Show modal when component loads
      };
    },
    methods: {
      closeModal() {
        this.showModal = false;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Modal overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  /* Modal box */
  .modal-box {
    background: #fff;
    padding: 20px;
    width: 90%;
    max-width: 400px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    margin-bottom: 10px;
    color: #333;
  }
  
  p {
    margin-bottom: 10px;
    color: #666;
  }
  
  .support-text {
    font-size: 14px;
    color: gray;
  }
  
  button {
    background: #3085d6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  button:hover {
    background: #2568a6;
  }
  </style>
  