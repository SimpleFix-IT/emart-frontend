<template>
<div class="categories-page">
    <!-- Category Section -->
    <section id="carouselSection" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
        <div class="carousel-inner">
            <!-- Carousel Item 1 -->
            <div class="carousel-item active">
                <img src="@/assets/img2.webp" class="d-block w-100" alt="Promo Image 1">
                
            </div>
            <!-- Carousel Item 2 -->
            <div class="carousel-item">
                <img src="@/assets/img2.webp" class="d-block w-100" alt="Promo Image 2">
                
            </div>
            <!-- Carousel Item 3 -->
            <div class="carousel-item">
                <img src="@/assets/img1.webp" class="d-block w-100" alt="Promo Image 3">
                
            </div>
        </div>
        <!-- Carousel Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselSection" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselSection" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </section>

    <!-- Filters and Search Section -->
    <section class="filters-search py-4">
        <div class="container">
            <div class="row">
                <!-- Search Bar -->
                <div class="col-lg-8">
                    <input type="text" class="form-control" v-model="searchQuery" @input="searchSubCategory" placeholder="Search Sub Categories" />
                </div>
                <!-- Category Filter -->
                <div class="col-lg-4">
                    <select class="form-select" v-model="selectedSubCategory" @change="applyFilters">
                        <option value="">All Categories</option>
                        <option v-for="subCategory in SubCategoriesFilters" :key="subCategory.id" :value="subCategory.id">
                            {{ subCategory.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </section>
    <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <div v-if="errorMessage && errorMessage.trim() !== ''" class="alert alert-danger text-center">
        {{ errorMessage }}
    </div>
    <!-- Categories Grid Section -->
    <!-- <section class="categories py-5">
        <div class="container" v-if="subCategories.length > 0">
            <h2 class="text-center mb-5">Sub Categories</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                <div class="col" v-for="category in subCategories" :key="category.id">
                    <div class="card category-card shadow-sm">
                        <img :src="getImageUrl(category.image)" class="card-img-top" alt="Category Image">
                        <div class="card-body text-center">
                            <h5 class="card-title">{{ category.name }}</h5>
                            <a :href="category.link" class="btn btn-category" @click="fetchProductsByCategory(category.id)">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h3 v-else-if="!loading" class="er text-center text-danger">
            Subcategories not found.
        </h3>
    </section> -->
    <section class="categories py-5">
        <div class="container" v-if="subCategories.length > 0">
            <h2 class="text-center mb-5">Shop by Categories</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                <div class="col" v-for="category in subCategories" :key="category.id">
                    <div class="card category-card shadow-sm">
                        <img :src="getImageUrl(category.image)" class="card-img-top" alt="Category Image">
                        <div class="card-body text-center">
                            <h5 class="card-title">{{ category.name }}</h5>
                            <a href="javascript:void(0)" class="btn btn-primarys" @click.prevent="fetchProductsByCategory(category.id)">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h3 v-else-if="!loading" class="er text-center text-danger">
            Subcategories not found.
        </h3>
    </section>

</div>
</template>

<script>
import {ref,onMounted} from 'vue';
import {getImageUrl,useDebouncedFunction} from '@/utils/Helper';
import {useRoute,useRouter} from 'vue-router';
import apiClient from '@/service/Index';
import showToast from "@/plugins/toast.js";
export default {
    name: 'SubCategories',
    setup() {
        const route = useRoute();
        const router = useRouter();
        const searchQuery = ref([]);
        const SubCategoriesFilters = ref([]);
        const selectedSubCategory = ref('');
        const loading = ref(true);
        const categoryId = route.params.categoryId;
        const subCategories = ref([]);
        const errorMessage = ref('');
    
        const fetchSubCategories = async () => {
            try {
                const responseSubCategories = await apiClient.get(`fetch-sub-category/${categoryId}`);
                if (responseSubCategories.data.success) {
                    subCategories.value = responseSubCategories.data.subcategory;
                    SubCategoriesFilters.value =  responseSubCategories.data.subcategory;
                    showToast("success", "Sub categories found successfully.");
                    loading.value = false;
                }
                else {
                    throw new Error('Failed to load subcategories. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                errorMessage.value = 'There was an issue loading the subcategories. Please try again later.';
                loading.value = false;
            }
        };
        const fetchProductsByCategory = async (catId) => {
            try {
                const responseProduct = await apiClient.get(`fetch-product/${catId}`);
                if(responseProduct.data && responseProduct.data.success){
                    router.push({ name: 'product', params: { subCatId: catId } });
                    console.log(responseProduct.data);
                } else {
                    throw new Error('No products available for this category.');
                }
            } catch (error) {
                errorMessage.value = 'Sorry, there are no products available for this category.';
                console.error('Error fetching products:', error);
            }
        };
         const searchSubCategory = () => {
            debouncedSearch();
        };
       const debouncedSearch = useDebouncedFunction(async () => {
            try {
                 if (!searchQuery.value.trim()) {
                    fetchSubCategories();
                    return;
                }if (!isNaN(searchQuery.value)) {
                    console.log('Please input a valid string value');
                    return;
                }
                const searchResponse = await apiClient.get(`/search-subcategories/${searchQuery.value}/${categoryId}`);
                
                if (searchResponse.data.success && searchResponse.data.subCategories.length > 0) {
                    subCategories.value = searchResponse.data.subCategories;
                } else {
                    subCategories.value = []; 
                }
                loading.value = false;
            } catch (error) {
                console.error('Error searching sub categories:', error.message);
                subCategories.value = [];
                loading.value = false;
            }
        }, 500);
        const applyFilters = () => {
            if (!selectedSubCategory.value) {
                subCategories.value = SubCategoriesFilters.value;
                return;
            }
            const filtered = SubCategoriesFilters.value.filter(subCategory => 
                subCategory.id === Number(selectedSubCategory.value)
                
            );
            subCategories.value = filtered; 
        };
        
        onMounted(() => {
            fetchSubCategories();
        });
        return {
            subCategories,
            categoryId,
            getImageUrl,
            loading,
            fetchProductsByCategory,
            searchQuery,
            SubCategoriesFilters,
            searchSubCategory,
            selectedSubCategory,
            errorMessage,
            applyFilters        
        };
    }
}
</script>

<style scoped>
@import '@/assets/website/categories.css';
</style>
