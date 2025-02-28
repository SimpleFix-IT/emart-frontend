<template>
    <div class="sidebar bg-light">
        <!-- <div class="sidebar-header text-center p-3">
            <div class="user-info">
                <img src="@/assets/loginImg.jpg" alt="User" class="user-avatar" />
                <p class="mb-0">Jhon Doe</p>
                <small>Admin</small>
            </div>
        </div> -->

        <ul class="nav flex-column">
            <li class="nav-item">
                <router-link to="/admin-dashboard" class="nav-link">Dashboard</router-link>
            </li>
            <!-- Category Section with Dropdown -->
            <li class="nav-item">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#categoryDropdown" aria-expanded="false">
                    Category Section
                </a>
                <ul id="categoryDropdown" class="collapse bg-transparent border-0">
                    <li>
                        <router-link to="/admin-dashboard/category" class="dropdown-item">Categories</router-link>
                    </li>
                    <li>
                        <router-link to="/admin-dashboard/sub-category" class="dropdown-item">Sub Category</router-link>
                    </li>
                </ul>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#productDropdown" aria-expanded="false">
                    Products Section
                </a>
                <ul id="productDropdown" class="collapse bg-transparent border-0">
                    <li>
                        <router-link to="/admin-dashboard/add-product" class="dropdown-item">Add Product</router-link>
                    </li>
                </ul>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#dealDropdown" aria-expanded="false">
                    Deal Section
                </a>
                <ul id="dealDropdown" class="collapse bg-transparent border-0">
                    <li>
                        <router-link to="/admin-dashboard/add/deal" class="dropdown-item">Add Deal</router-link>
                    </li>
                </ul>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="collapse" data-bs-target="#couponDropdown" aria-expanded="false">
                    Coupon Section
                </a>
                <ul id="couponDropdown" class="collapse bg-transparent border-0">
                    <li>
                        <router-link to="/admin-dashboard/add/coupon" class="dropdown-item">Add Coupon</router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

  <script>
  export default {
    name: "Sidebar",
  };
  </script>

  <style scoped>
  .sidebar {
    height: 100vh;
    width: 250px;
    position: fixed;
    left: 0;
    top: 0;
    overflow-y: auto;
    padding-top: 20px;
  }

  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .nav-link {
    padding: 10px 20px;
    font-size: 16px;
  }

  /* Optional: reduce opacity of inactive sections */
  .nav-item .collapse:not(.show) {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 200px;
    }

    .nav-link {
      font-size: 14px;
    }
  }
  </style>
