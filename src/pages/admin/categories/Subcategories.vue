<template>
<AdminLayout>
    <div class="categories">
        <router-link to="/admin-dashboard/sub-category">
            <button class="btn btn-success btn-lg">Add Subcategory</button>
        </router-link>
    </div>
    <div class="col-md-9 mx-auto">
        <!-- Categories Page -->
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white text-center">
                <h4>SubCategories List</h4>
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
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(subCategory, index) in Subcategories" :key="subCategory.id">
                                <td>{{ index + 1 }}</td>
                                <td>{{ subCategory.name }}</td>
                                <td>{{ subCategory.description }}</td>
                                <td>
                                    <img :src="getImageUrl(subCategory.image)" alt="" style="width: 100px;">
                                </td>
                                <td>
                                    <button
                                        :class="['btn-status', subCategory.status === 1 ? 'badge bg-success' : 'badge bg-danger']"
                                        @click="toggleStatus(subCategory.id)">
                                        {{ subCategory.status === 1 ? 'Active' : 'Inactive' }}
                                    </button>
                                </td>
                                <td class="action">
                                    <button class="btn btn-info btn-sm" @click="viewSubCategory(subCategory)">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-success btn-sm" @click="editSubCategory(subCategory)">
                                        <i class='fas fa-pencil-alt'></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" @click="deleteSubCategory(subCategory.id)">
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
                        <p><strong>Name:</strong> {{ selectedSubCategory?.name || ''}}</p>
                        <p><strong>Description:</strong> {{ selectedSubCategory?.description || ''}}</p>
                        <p>
                            <strong>Image:</strong><br />
                            <img :src="getImageUrl(selectedSubCategory?.image)" alt="subCategory Image" style="width: 400px;">
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
                    <h5 class="modal-title">Update SubCategory</h5>
                    <button type="button" class="close" @click="closeUpdateModal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="updateSubCategory">
                        <div class="form-group">
                            <label for="Name">Name</label>
                            <input id="Name" v-model="selectedSubCategory.name" type="text" class="form-control" placeholder="Enter subcategory name" required />
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" v-model="selectedSubCategory.description" class="form-control" rows="4" placeholder="Enter a brief description"></textarea>
                        </div>
                        <div class="form-group mt-3">
                            <label for="categoryImage">Sub Category Image</label>
                            <input id="categoryImage" type="file" class="form-control" @change="handleImageUpload" />
                            <div class="mt-3 text-center">
                                <img v-if="selectedSubCategory.image" :src="getImageUrl(selectedSubCategory.image)" alt="subCategory Image" style="width: 200px;" />
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeUpdateModal">
                        Close
                    </button>
                    <button type="button" class="btn btn-primary" @click="updateSubCategory">
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
import showToast from "@/plugins/toast";
const Subcategories = ref([]);
const showModal = ref(false);
const showUpdateModal = ref(false);
const isLoading = ref(false);
const selectedSubCategory = ref({
    id: null,
    name: "",
    image: null,
    description:"",
});
const formData = new FormData();
const fetchSubCategories = async () => {
    isLoading.value = true
    try {
        const response = await apiClient.get("/sub-categories");
        if (response.data ?.success) {
            Subcategories.value = response.data.allSubCategories || [];
            isLoading.value = false
        } else {
            Subcategories.value = [];
            console.log(" Sub Categories not found");
        }
    } catch (error) {
        console.log(error.response.data ?.message);
        Subcategories.value = [];
        isLoading.value = false
    }
};

// View category action
const viewSubCategory = (subCategory) => {
    selectedSubCategory.value = subCategory;
    showModal.value = true;
};

const editSubCategory = (subCategory) => {
    selectedSubCategory.value = subCategory;
    showUpdateModal.value = true

}
// Close modal action
const closeModal = () => {
    showModal.value = false;
};
const closeUpdateModal = () => {
    showUpdateModal.value = false;
};

// Delete category action
const deleteSubCategory = async (id) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
        try {
            isLoading.value = true
            const removeCategoryResponse = await apiClient.get(`remove-sub-category/${id}`);
            if (removeCategoryResponse.data ?.success) {
                await fetchSubCategories();
                alert("Sub Category remove successfully");
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
    }
}
const updateSubCategory = async () => {
    try {
        formData.append("name", selectedSubCategory.value.name);
        formData.append("description", selectedSubCategory.value.description);
        const response = await apiClient.post(`/add-subcategory/${selectedSubCategory.value.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.data.success) {
            alert("Category updated successfully!");
            await fetchSubCategories();
            closeUpdateModal();
            // Optionally, fetch the updated list of categories
        } else {
            alert("Failed to update the category.");
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
const toggleStatus = async (id) => {
    try {
        const { data } = await apiClient.post(`subcategory-status-update/${id}`);
        if (data?.success) {
            await fetchSubCategories();
            showToast("success", "Subcategory status updated successfully");
        } else {
            showToast("error", data?.message || "Failed to update sub category status");
        }
    } catch (error) {
        console.error("Server error:", error);
        if (error.response) {
            const message = error.response.data?.message || "Server returned an error";
            showToast("error", `Error: ${message}`);
        } else if (error.request) {
            showToast("error", "No response from the server. Please try again later.");
        } else {
            showToast("error", `Request failed: ${error.message}`);
        }
    }
};

// Fetch categories on mount
onMounted(() => {
    fetchSubCategories();
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
    max-width: 700px;
    /* Adjusted size for a larger modal */
    margin: auto;
    /* Centers the modal vertically and horizontally */
    top: 20%;
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
.btn-status {
    padding: 5px 9px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    color: #fff;
    transition: background-color 0.3s ease;
}
.btn-success {
  background-color: #28a745;
}

.btn-danger {
  background-color: #dc3545;
}

.btn:focus {
  outline: none;
}

</style>
