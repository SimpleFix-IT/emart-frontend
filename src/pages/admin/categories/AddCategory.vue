<template>
    <AdminLayout>
        <div class="categories">
            <router-link to="/admin-dashboard/categories">
                <button class="btn btn-success btn-lg">View Categories</button>
            </router-link>
        </div>
        <div class="card shadow-sm mt-5" style="max-width: 600px; margin: 0 auto;">
           
            <div class="card-header bg-primary text-white text-center">
                <h4>Add New Category</h4>
            </div>
            <div class="card-body">
                <form id="categoryForm" @submit.prevent="handleCategoryAdd">
                    <div class="row">
                        <!-- Category Name Field -->
                        <div class="col-md-12 mb-3">
                            <label for="categoryName" class="form-label">Category Name</label>
                            <input type="text" id="categoryName" name="categoryName" class="form-control" placeholder="Enter category name" v-model="formData.name" />
                        </div>

                        <!-- Category Image Field -->
                        <div class="col-md-12 mb-3">
                            <label for="categoryImage" class="form-label">Category Image</label>
                            <input type="file" id="categoryImage" name="categoryImage" class="form-control" @change="handleCategoryImage" />
                        </div>

                        <!-- Submit Button -->
                        <div class="col-12 text-center mt-3">
                            <button type="submit" class="btn btn-success px-4 py-2">
                                Add Category
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import {reactive} from 'vue';
import apiClient from '@/service/Index';
        const formData = reactive({
            name: '',
            image: null,
        })
        const handleCategoryImage = ((e) => {
            const image = e.target.files[0];
            if (image) { 
                formData.image = image;
            }
            console.log(image);
        })
        const handleCategoryAdd = async () => {
            if (!formData.name || !formData.image) {
                alert('All fields are required');
                return;
            }
            const form = new FormData();
            form.append('name', formData.name);
            form.append('image', formData.image);
            try {
                const response = await apiClient.post('/add-category', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    formData.name = '';
                    formData.image = null;
                    document.getElementById('categoryImage').value = '';
                    alert('Category added successfully');
                }

            } catch (error) {
                console.log('something wrong', error);
                alert('server side error');
            }

        };
  </script>
 <style scoped>
 .card {
   border-radius: 10px;
   overflow: hidden;
 }

 .card-header {
   background-color: #007bff;
 }

 .card-body {
   background-color: #f8f9fa;
   padding: 25px;
 }

 .form-control {
   height: 38px;
 }

 .btn-success {
   width: 100%;
   padding: 12px 20px;
 }

 @media (max-width: 576px) {
   .card {
     width: 100%;
   }

   .form-control {
     font-size: 14px;
   }

   .btn-success {
     padding: 10px 15px;
   }
 }
 .categories {
    margin-left: 88%;
    font-size: larger;
    font-weight: bold;
    color: black;
}
 </style>
