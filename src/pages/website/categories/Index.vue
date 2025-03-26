<template>
<div class="categories-page">
    <section class="categories-hero">
        <div class="categories-hero-content">
            <h1 class="categories-hero-title">Explore Our Categories</h1>
            <p class="categories-hero-subtitle">Find exactly what you need from our wide range of categories.</p>
            <router-link to="/shop" class="categories-hero-btn">Start Shopping</router-link>
        </div>
    </section>

    <section class="filters-search py-4">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <input type="text" class="form-control"  v-model="searchQuery" @input="SearchCategory" placeholder="Search Categories" />
                </div>
                <div class="col-lg-4">
                    <select class="form-select" v-model="selectedCategory" @change="applyFilters">
                        <option value="">Select Categories</option>
                        <option v-for="category in CategoriesFilters" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </section>
    
    <div v-if="errorMessage && errorMessage.trim() !== ''" class="alert alert-danger text-center">
        {{ errorMessage }}
    </div>
    <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    <section class="categories py-5" v-if="categories.length > 0">
        <div class="container">
            <h2 class="text-center mb-5">Shop by Categories</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                <div class="col" v-for="category in categories" :key="category.id">
                    <div class="card category-card shadow-sm">
                        <img :src="getImageUrl(category.image)" class="card-img-top" alt="Category Image">
                        <div class="card-body text-center">
                            <h5 class="card-title">{{ category.name }}</h5>
                                <a href="javascript:void(0)" class="btn btn-primarys" @click.prevent="handleFetchSubCategory(category.slug,category.id)">Shop Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
     <h3 v-else-if="!loading" class="er text-center text-danger">
        No Categoires found.
    </h3>
</div>
</template>
<script>
import {ref,onMounted} from 'vue';
import {getImageUrl,useDebouncedFunction} from '@/utils/Helper.js';
import apiClient from '@/service/Index';
import {useRouter} from 'vue-router';
import showToast from "@/plugins/toast.js";
export default {
    name: 'Index',
    setup() {
        const categories = ref([]);
        const selectedCategory = ref('');
        const router           = useRouter();
        let loading = ref(true);
        const errorMessage = ref('');
        const searchQuery = ref([]);
        const CategoriesFilters = ref([]);
        onMounted(() => {
            fetchCategories();
        });
        const fetchCategories = async ()=> {
            try {
            const response = await apiClient.get('/fetch-categories');
            if (response.data?.success) {
                loading.value= false;
                categories.value = response.data.allCategories;
                CategoriesFilters.value =  response.data.allCategories
                // showToast("success", "Categories found successfully.");
            }
            else {
                throw new Error('Failed to fetch categories');
             
            }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('Categories not found:', error.response.data);
                    showToast("error", "Categories not found.");
                } else {
                    console.error('Error fetching categories:', error);
                    showToast("error", "An error occurred while fetching categories.");
                }
                categories.value = [];
                loading.value = false;
            }
        };

       const  handleFetchSubCategory = async (categorySlug,categoryId) => {
        try {
          const responseSubCategory = await apiClient.get(`fetch-sub-category/${categoryId}`);
          if(responseSubCategory.data.success)
          {
            router.push({ name: 'sub-categories',  params: { categorySlug, categoryId } });
          }
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.error || error.response.data?.message || "Server returned an error";
                showToast("error", `Error: ${message}`);
            } else if (error.request) {
                showToast("error", "No response from the server. Please try again later.");
            } else {
                showToast("error", `Request failed: ${error.message}`);
            }
        }
      };
      const SearchCategory = () => {
            debouncedSearch();
      };
      const debouncedSearch = useDebouncedFunction(async () => {
        try {
            if (!searchQuery.value.trim()) {
                fetchCategories();
                return;
            }if (!isNaN(searchQuery.value)) {
                console.log('Please input a valid string value');
                showToast("error", "Please input a valid string value");
                return;
            }
            const searchResponse = await apiClient.get(`/search-categories/${searchQuery.value}`)
            if(searchResponse.data){
                categories.value = searchResponse.data.categories;
                console.log(categories.value);
            }else{
                 categories.value = [];
            }
        } catch (error) {
            console.error('Error searching categories:', error.message);
            showToast("error", "Error searching categories");
            categories.value = [];
            loading.value = false;
        }
      }, 500);
      const applyFilters = () => {
        if (!selectedCategory.value) {
            categories.value = CategoriesFilters.value;
            return;
        }
        const filtered = CategoriesFilters.value.filter(category => 
            category.id === Number(selectedCategory.value)
        );
        categories.value = filtered; 
    };


        return {
            categories,
            getImageUrl,
            loading,
            CategoriesFilters,
            fetchCategories,
            selectedCategory,
            handleFetchSubCategory,
            errorMessage,
            SearchCategory,
            searchQuery,
            applyFilters
 
        };
    }

};
</script>

<style scoped>

@import '@/assets/website/categories.css';
/* .carousel-inner img {
    max-height: 500px;
    object-fit: cover;
} */
/* 
.filters-search {
    background-color: #f7f7f7;
    padding: 20px 0;
    position: relative;
}

.filters-search input,
.filters-search .form-select {
    font-size: 1rem;
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    border: 1px solid #ccc;
    width: 100%;
}


.categories {
    background-color: #f7f7f7;
    padding: 40px 0;
}

.card.category-card {
    border: none;
    border-radius: 15px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card.category-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-img-top {
    border-radius: 15px 15px 0 0;
    object-fit: cover;
    height: 200px;
}

.card-body {
    padding: 1.5rem;
    background-color: #fff;
}

.card-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
}

.card-text {
    color: #777;
    font-size: 0.9rem;
}

.btn-primary {
    background-color: #28a745;
    border-color: #28a745;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #218838;
    border-color: #1e7e34;
}

.categories h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #444;
    text-align: center;
    margin-bottom: 40px;
}

.spinner-border.text-primary {
    position: absolute;
    top: 500px;
    z-index: 1;
}

@media (max-width: 1024px) {
    .card-img-top {
        height: 180px;
    }

    .card-title {
        font-size: 1.2rem;
    }

    .filters-search {
        padding: 15px 0;
    }

    .filters-search input,
    .filters-search .form-select {
        padding: 0.75rem 1rem;
    }

    .categories h2 {
        font-size: 1.8rem;
    }

    .row-cols-md-2 {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .carousel-inner img {
        max-height: 200px;
    }

    .filters-search {
        padding: 10px 0;
    }

    .card-img-top {
        height: 140px;
    }

    .card-title {
        font-size: 1rem;
    }

    .categories h2 {
        font-size: 1.4rem;
    }

    .row-cols-1 {
        grid-template-columns: 1fr;
    }

    .row-cols-md-2,
    .row-cols-lg-4 {
        grid-template-columns: repeat(2, 1fr);
    }

    .card.category-card {
        margin-bottom: 20px;
    }
}

@media (max-width: 480px) {
    .carousel-inner img {
        max-height: 200px;
    }

    .filters-search {
        padding: 10px 0;
    }

    .card-img-top {
        height: 140px;
    }

    .card-title {
        font-size: 1rem;
    }

    .categories h2 {
        font-size: 1.4rem;
    }
} */


/* hero section css */
.categories-hero {
    position: relative;
    width: 100%;
    height: 30vh; /* Adjusted for a premium look */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 20px;
    background: linear-gradient(135deg, #ff7e5f, #feb47b, #ffcc33); /* Warm, vibrant gradient */

}

.categories-hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Dark overlay for readability */
}

.categories-hero-content {
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.1); /* Light transparent background */
    padding: 30px;
    border-radius: 12px;
    backdrop-filter: blur(5px); /* Glassmorphism effect */
}

.categories-hero-title {
    font-size: 2.8rem;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 12px;
}

.categories-hero-subtitle {
    font-size: 1.4rem;
    margin-bottom: 20px;
}

.categories-hero-btn {
    background: #ffcc33;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    transition: 0.3s ease-in-out;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.categories-hero-btn:hover {
    background: #ff9900;
    transform: scale(1.05);
}

/* ✅ Responsive Design */
@media (max-width: 768px) {
    .categories-hero {
        height: 40vh;
        padding: 10px;
    }

    .categories-hero-title {
        font-size: 2.2rem;
    }

    .categories-hero-subtitle {
        font-size: 1.1rem;
    }

    .categories-hero-btn {
        font-size: 1rem;
        padding: 10px 20px;
    }
}

</style>
