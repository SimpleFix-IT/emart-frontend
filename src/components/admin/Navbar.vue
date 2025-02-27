
 <template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid">
        <input type="text" class="form-control search-bar" placeholder="Search" />
        <div class="navbar-icons d-flex align-items-center">
          <button class="btn btn-light mx-2">Message</button>
          <button class="btn btn-light mx-2">Notification</button>
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown">
              Jhon Doe
            </button>
            <ul class="dropdown-menu">
              <li><router-link to="/admin-dashboard/profile" class="dropdown-item">Profile</router-link></li>
              <li><router-link to="/admin-dashboard/change-password" class="dropdown-item">Change password</router-link></li>
              <a href="#" class="dropdown-item" @click="handleLogout" v-if="token">Log Out</a>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
import apiClient from '@/service/Index';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import showToast from '@/plugins/toast';
export default {
    name: 'Navbar',

    setup() {
        const store = useStore();
        const router = useRouter();
        const handleLogout = async () => {
            try {
                const response = await apiClient.post('/logout');
                console.log(response.data);
                if (response.data.status === 200) {
                    store.dispatch('auth/logout');
                    router.push('/');
                    showToast("success", "Logout successfully");
                }
            } catch (error) {
                
               console.log('something wrong',error);
            }

        };
         const token = computed(() => store.getters['auth/getToken']);
        return {
            handleLogout,
            token, 
        }
    }
};
  </script>
  
  <style scoped>
  .search-bar {
    max-width: 300px;
  }
  .mx-2 {
    margin-right: 2.5rem !important;
    margin-left: 1.5rem !important;
}
.dropup, .dropend, .dropdown, .dropstart {
    position: relative;
    right: 32px;
}
.align-items-center {
    align-items: center !important;
    gap: 42px;
}
  </style>
  