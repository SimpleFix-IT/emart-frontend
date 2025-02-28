<template>
    <AdminLayout>
        <div class="categories">
            <router-link to="/admin-dashboard/add-product">
                <button class="btn btn-success btn-lg">Add Products</button>
            </router-link>
        </div>
        <div class="col-md-9 mx-auto">
            <!-- Categories Page -->
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white text-center">
                    <h4>Products List</h4>
                </div>
                <div v-if="isLoading" class="loader-overlay">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div class="card-body">
                    <!-- Categories Table -->
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(product, index) in products" :key="product.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.description }}</td>
                                    <!-- <td>{{ parseInt(product.price )}}</td>
                                    <td>{{ parseInt(product.discount_price )}}</td>
                                    <td>{{ product.stock }}</td> -->
                                    <td>
                                        <img :src="getImageUrl(product.image)" alt="" style="width: 100px;">
                                    </td>
                                    <td class="action">
                                        <!-- View Icon -->
                                        <button class="btn btn-info btn-sm" @click="viewProduct(product)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-success btn-sm" @click="editProduct(product)">
                                            <i class='fas fa-pencil-alt'></i>
                                        </button>
    
                                        <!-- Delete Icon -->
                                        <button class="btn btn-danger btn-sm" @click="deleteProduct(product.id)">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal -->
        <div v-if="showModal" class="modal fade show" style="display: block; background: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">SubCategory Details</h5>
                        <button type="button" class="close" @click="closeModal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center">
                            <p><strong>Name:</strong> {{ selectedProduct?.name || ''}}</p>
                            <p><strong>Description:</strong> {{ selectedProduct?.description || ''}}</p>
                            <p><strong>Price:</strong> {{ parseInt(selectedProduct?.price || '')}}</p>
                            <p><strong>Discount Price:</strong> {{ parseInt(selectedProduct?.discount_price || '')}}</p>
                            <p><strong>Stock:</strong> {{ selectedProduct?.stock || ''}}</p>
                            <p>
                                <strong>Image:</strong><br />
                                <img :src="getImageUrl(selectedProduct?.image)" alt="subCategory Image" style="width: 200px;">
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Update Modal -->
        <div v-if="showUpdateModal" class="modal fade show" style="display: block; background: rgba(0, 0, 0, 0.5);" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Update Product</h5>
                        <button type="button" class="close" @click="closeUpdateModal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateProduct">
                            <div class="form-group">
                                <label for="Name">Name</label>
                                <input id="Name" v-model="selectedProduct.name" type="text" class="form-control" placeholder="Enter product name" required />
                            </div>
                            <div class="form-group">
                                <label for="price">Price</label>
                                <input id="price" v-model="selectedProduct.price" type="text" class="form-control" placeholder="Enter product price" required />
                            </div>
                            <div class="form-group">
                                <label for="discount price">Discount Price</label>
                                <input id="discountPrice" v-model="selectedProduct.discount_price" type="text" class="form-control" placeholder="Enter product discount price" required />
                            </div>
                            <div class="form-group">
                                <label for="stock">Stock</label>
                                <input id="stock" v-model="selectedProduct.stock" type="text" class="form-control" placeholder="Enter product stock" required />
                            </div>
                            <div class="form-group">
                                <label for="description">Description</label>
                                <textarea id="description" v-model="selectedProduct.description" class="form-control" rows="4" placeholder="Enter a brief description"></textarea>
                            </div>
                            <div class="form-group mt-3">
                                <label for="productImage">Image</label>
                                <input id="productImage" type="file" class="form-control" @change="handleImageUpload" />
                                <div class="mt-3 text-center">
                                    <img v-if="selectedProduct.image" :src="getImageUrl(selectedProduct.image)" alt="product Image" style="width: 80px;" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeUpdateModal">
                            Close
                        </button>
                        <button type="button" class="btn btn-primary" @click="updateProduct">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    
    </AdminLayout>
    </template>
    
    <script setup>
    import AdminLayout from "@/layouts/AdminLayout.vue";
    import apiClient from "@/service/Index";
    import {getImageUrl} from "@/utils/Helper";
    import {ref,onMounted} from "vue";
    const products = ref([]);
    const showModal = ref(false);
    const showUpdateModal = ref(false);
    const isLoading = ref(false);
    const selectedProduct = ref({
        id: null,
        name: "",
        image: null,
        description:"",
        price: "",
        discountPrice: "",
        stock: "",
    });
    const formData = new FormData();
    const fetchProducts = async () => {
        isLoading.value = true
        try {
            const response = await apiClient.get("/get-products");
            if (response.data ?.success) {
                products.value = response.data.products || [];
                isLoading.value = false
            } else {
                products.value = [];
                console.log(" Products not found");
            }
        } catch (error) {
            console.log(error.response.data ?.message);
            products.value = [];
            isLoading.value = false
        }
    };
    
    // View category action
    const viewProduct = (product) => {
        selectedProduct.value = product;
        showModal.value = true;
    };
    
    const editProduct = (subCategory) => {
        selectedProduct.value = subCategory;
        showUpdateModal.value = true
    
    }
    // Close modal action
    const closeModal = () => {
        showModal.value = false;
    };
    const closeUpdateModal = () => {
        showUpdateModal.value = false;
    };
    
    // Delete Product action
    const deleteProduct = async (id) => {
        if (confirm("Are you sure you want to delete this Product?")) {
            try {
                isLoading.value = true
                const removeProductResponse = await apiClient.get(`remove-product/${id}`);
                if (removeProductResponse.data ?.success) {
                    await fetchProducts();
                    alert("Product remove successfully");
                } else {
                    alert('something wrong');
                }
            } catch (error) {
                console.log(error);
                isLoading.value = false
            }
    
        }
    };
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            formData.append("image", file);
            console.log(file);
        }
    }
    const updateProduct = async () => {
        try {
            formData.append("name", selectedProduct.value.name);
            formData.append("description", selectedProduct.value.description);
            formData.append("price", selectedProduct.value.price);
            formData.append("discountPrice", selectedProduct.value.discount_price);
            formData.append("stockQuantity", selectedProduct.value.stock);
            const response = await apiClient.post(`/add-product/${selectedProduct.value.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.success) {
                alert("Product updated successfully!");
                await fetchProducts();
                closeUpdateModal();
                // Optionally, fetch the updated list of categories
            } else {
                alert("Failed to update the Product.");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                // Access specific validation errors
                const validationErrors = error.response.data.errors;
    
                if (validationErrors.name) {
                    console.error(validationErrors.name[0]);
                    alert(validationErrors.name[0]);
                }
    
                if (validationErrors.image) {
                    console.error(validationErrors.image[0]);
                    alert(validationErrors.image[0]);
                }
            } else {
                // Handle other unexpected errors
                console.error("An unexpected error occurred", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    };
    
    // Fetch categories on mount
    onMounted(() => {
        fetchProducts();
    });
    </script>
    
    <style scoped>
    .card {
        border-radius: 10px;
    }
    
    .card-header {
        background-color: #007bff;
    }
    
    .card-body {
        background-color: #f8f9fa;
    }
    
    .table {
        margin-top: 20px;
        width: 100%;
    }
    
    .table th,
    .table td {
        vertical-align: middle;
    }
    
    .table th td {
        text-align: center;
    }
    
    .table-hover tbody tr:hover {
        background-color: #f1f1f1;
    }
    
    button {
        margin: 5px;
    }
    
    button i {
        font-size: 16px;
    }
    .modal-dialog {
        max-width: 600px;
        margin: auto;
        top: 10%;
        transform: translateY(-50%);
    }
    
    .modal-content {
        border-radius: 10px;
    }
    
    .modal-header {
        background-color: #007bff;
        color: white;
        border-bottom: none;
    }
    
    .modal-footer {
        border-top: none;
    }
    
    .modal-body {
        background-color: #f8f9fa;
    }
    
    .text-center {
        text-align: center;
    }
    
    @media (max-width: 768px) {
    
        .table th,
        .table td {
            font-size: 14px;
        }
    }
    
    .loader-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
        z-index: 10;
    }
    
    .categories {
        margin-left: 86%;
        font-size: larger;
        font-weight: bold;
        color: black;
        margin-bottom: 14px;
    }
    td.action {
        width: 149px;
    }
    </style>
    