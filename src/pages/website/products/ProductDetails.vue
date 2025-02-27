<template>
<section class="product-details py-5" v-if="product">
  <div class="container">
    <div class="row align-items-center">
      <!-- Product Image -->
      <div class="col-md-6 text-center">
        <img :src="getImageUrl(product.image)" class="product-images img-fluid" alt="Product Image">
      </div>
      <div class="col-md-6">
        <div class="product-content">
          <h2 class="product-name">{{ product.name }}</h2>
          <p class="product-description">{{ product.description }}</p>
          <p class="price">
            ₹{{ parseInt(product.discount_price) }} 
            <span class="dis">Offer Price</span> 
          </p>
          <p class="price text-danger original-price">
            ₹{{ parseInt(product.price) }}
          </p>
          <div class="d-flex">
            <button class="btn btn-primarys me-2" @click="handleAddToCart(product.id)">Add to Cart</button>
            <button class="btn btn-detail" @click="viewDetails(product.slug, product.id)">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


</template>
<script>
import apiClient from '@/service/Index';
import { ref,onMounted,computed } from 'vue';
import {useRoute,useRouter} from 'vue-router'
import {getImageUrl} from '@/utils/Helper'
import store from '@/store/Index';
import showToast from '@/plugins/toast';
export default {
  setup(){
    const route = useRoute();
    const router = useRouter();
    const slug = route.params.productSlug;
    const product = ref(null);
    const userData =computed(() => ({
        role: store.getters['auth/getRole'],
        token:  store.getters['auth/getToken'],
    }));
    const productFetch = async (slug) => {
      try {
          const response = await apiClient.get(`/product-details/${slug}`);
          if(response?.data){
            product.value = response.data.product;
          }else{
            product.value ='';
          }
      } catch (error) {
          console.error("Error fetching product:", error);
      }
    };
    const handleAddToCart = async (id) => {
      if (!userData.value.token) {
          localStorage.setItem('redirectPath', window.location.pathname);
          alert('Please log in to add items to the cart.');
          showToast("info", "Please log in to add items to the cart.");
          return router.push({ name: 'Login' });
      }
      try {
          const responseAddToCart = await apiClient.post('/add-to-cart', { productId: id });
          if (responseAddToCart?.data) {
              const userItemCount = responseAddToCart.data.count;
              store.dispatch('userCart/userCartItem',userItemCount);
              if(responseAddToCart.data.message == 'Product added to the cart successfully.'){
                  showToast("success", responseAddToCart.data.message);
                    return router.push({ name: 'Cart' });
              }
              if (responseAddToCart.data.message == 'Product is already in the cart.') {
                  showToast("info", responseAddToCart.data.message);
              }
          }
      } catch (error) {
        showToast("error", "Failed to add item to cart. Please try again.");
        console.error('Error adding to cart:', error);
        // alert('Failed to add item to cart. Please try again.');
      }
    };
    onMounted(() => {
        if (slug) {
            productFetch(slug);
        } else {
            console.error('Product slug is not available');
        }
    });
      return {
        slug,
        product,
        getImageUrl,
        handleAddToCart
    }
  }
}
</script>
<style scoped>
@import '@/assets/website/home.css';

/* @import '@/assets/website/product.css'; */
@import '@/assets/website/product-details.css';

  
</style>