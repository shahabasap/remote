<template>
	<div class="people-layout">
	  <!-- Sidebar Navigation -->
	  <div class="sidebar">
		<div class="sidebar-header">
		  <h2>People Portal</h2>
		</div>
		<nav class="sidebar-nav">
		  <router-link to="/dashboard" class="nav-item">
			<v-icon name="dashboard" />
			<span>Dashboard</span>
		  </router-link>
		  <router-link to="/teams" class="nav-item">
			<v-icon name="groups" />
			<span>Teams</span>
		  </router-link>
		  <router-link to="/people" class="nav-item active">
			<v-icon name="people" />
			<span>People</span>
		  </router-link>
		  <router-link to="/tasks" class="nav-item">
			<v-icon name="check_circle" />
			<span>Tasks</span>
		  </router-link>
		</nav>
		<div class="sidebar-footer">
		  <div class="user-profile">
			<v-avatar :src="getAssetUrl(user?.avatar)" small />
			<span>{{ user?.first_name }} {{ user?.last_name }}</span>
		  </div>
		</div>
	  </div>
	  
	  <div class="people-container dark-theme">
		<!-- People Section -->
		<div class="section-card">
		  <div class="section-header">
			<h2>People Management</h2>
			<div class="actions-container">
			  <button @click="refreshPeople" class="action-btn refresh" :disabled="loading.people">
				<v-icon name="refresh" :spin="loading.people" />
				{{ loading.people ? 'Refreshing...' : 'Refresh' }}
			  </button>
			  <button @click="openCreateDialog" class="action-btn create" :disabled="loading.people">
				<v-icon name="add" />
				Add Person
			  </button>
			</div>
		  </div>
  
		  <!-- Loading Skeleton -->
		  <div v-if="loading.people" class="loading-skeleton">
			<div v-for="i in itemsPerPage" :key="i" class="skeleton-row">
			  <div class="skeleton-avatar"></div>
			  <div class="skeleton-text short"></div>
			  <div class="skeleton-text medium"></div>
			  <div class="skeleton-badge"></div>
			</div>
		  </div>
  
		  <!-- People Table -->
		  <div v-else class="people-table-container">
			<table class="people-table">
			  <thead>
				<tr>
				  <th>Name</th>
				  <th>Email</th>
				  <th>Status</th>
				</tr>
			  </thead>
			  <tbody>
				<tr v-for="person in people" :key="person.id">
				  <td>
					<div class="person-info">
					  <v-avatar :src="getAssetUrl(person.avatar)" small />
					  <span>{{ person.first_name }} {{ person.last_name }}</span>
					</div>
				  </td>
				  <td>{{ person.email || 'N/A' }}</td>
				  <td>
					<span class="status-badge" :class="person.status">
					  {{ formatStatus(person.status) }}
					</span>
				  </td>
				</tr>
			  </tbody>
			</table>
		  </div>
  
		  <!-- Empty State -->
		  <div v-if="!loading.people && people.length === 0" class="empty-state">
			<v-icon name="people_outline" large />
			<p>No people found</p>
			<button @click="refreshPeople" class="action-btn refresh">
			  Try Again
			</button>
		  </div>
  
		  <!-- Pagination -->
		  <div v-if="people.length > 0 && !loading.people" class="pagination">
			<button @click="prevPage" :disabled="currentPage === 1 || loading.people">
			  <v-icon name="chevron_left" />
			</button>
			<span>Page {{ currentPage }} of {{ totalPages }}</span>
			<button @click="nextPage" :disabled="currentPage === totalPages || loading.people">
			  <v-icon name="chevron_right" />
			</button>
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import { useApi, useStores } from '@directus/extensions-sdk';
  import { ref, computed, onMounted } from 'vue';
  
  export default {
	setup() {
	  const api = useApi();
	  const { useUserStore } = useStores();
	  const userStore = useUserStore();
  
	  // State
	  const user = ref(userStore.currentUser);
	  const people = ref([]);
	  const loading = ref({ people: false });
	  const currentPage = ref(1);
	  const itemsPerPage = ref(2);
	  const totalItems = ref(0);
  
	  // Computed
	  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
  
	  // Methods
	  const getAssetUrl = (id) => id ? `${api.defaults.baseURL}/assets/${id}` : '';
  
	  const formatStatus = (status) => {
		const statusMap = {
		  active: 'Active',
		  inactive: 'Inactive',
		  pending: 'Pending'
		};
		return statusMap[status] || 'Unknown';
	  };
  
	  const fetchPeople = async () => {
		try {
		  loading.value.people = true;
		  const response = await api.get('/users', {
			params: { 
			  fields: ['id', 'first_name', 'last_name', 'email', 'status', 'avatar'],
			  limit: itemsPerPage.value,
			  page: currentPage.value,
			  meta: '*'
			}
		  });
		  people.value = response.data.data || [];
		  totalItems.value = response.data.meta?.total_count || 0;
		} catch (error) {
		  console.error('Error fetching people:', error);
		  people.value = [];
		} finally {
		  loading.value.people = false;
		}
	  };
  
	  const refreshPeople = () => {
		currentPage.value = 1;
		fetchPeople();
	  };
  
	  const editPerson = (person) => {
		console.log('Editing person:', person);
	  };
  
	  const confirmDelete = (person) => {
		console.log('Deleting person:', person);
	  };
  
	  const openCreateDialog = () => {
		console.log('Opening create dialog');
	  };
  
	  const nextPage = () => {
		if (currentPage.value < totalPages.value && !loading.value.people) {
		  currentPage.value++;
		  fetchPeople();
		}
	  };
  
	  const prevPage = () => {
		if (currentPage.value > 1 && !loading.value.people) {
		  currentPage.value--;
		  fetchPeople();
		}
	  };
  
	  onMounted(fetchPeople);
  
	  return {
		user,
		people,
		loading,
		currentPage,
		totalPages,
		itemsPerPage,
		getAssetUrl,
		formatStatus,
		refreshPeople,
		editPerson,
		confirmDelete,
		openCreateDialog,
		nextPage,
		prevPage
	  };
	}
  };
  </script>
  
  <style scoped>
  .people-layout {
	display: flex;
	min-height: 100vh;
  }
  
  .people-container {
	flex: 1;
	padding: 24px;
	background-color: var(--background-page);
  }
  
  .section-card {
	background: var(--background-subdued);
	padding: 24px;
	border-radius: 8px;
	box-shadow: var(--shadow);
  }
  
  .section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
  }
  
  .actions-container {
	display: flex;
	gap: 12px;
  }
  
  .action-btn {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	border-radius: 4px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
  }
  
  .action-btn.refresh {
	background: var(--primary);
	color: white;
	border: 1px solid var(--primary);
  }
  
  .action-btn.create {
	background: var(--success);
	color: white;
	border: 1px solid var(--success);
  }
  
  .people-table-container {
	margin-top: 20px;
	border-radius: 8px;
	overflow: auto;
  }
  
  .people-table {
	width: 100%;
	border-collapse: collapse;
  }
  
  .people-table th {
	background: var(--background-subdued);
	padding: 12px 16px;
	text-align: left;
	font-weight: 600;
	position: sticky;
	top: 0;
  }
  
  .people-table td {
	padding: 12px 16px;
	border-bottom: 1px solid var(--border-subdued);
  }
  
  .person-info {
	display: flex;
	align-items: center;
	gap: 12px;
  }
  
  .status-badge {
	display: inline-block;
	padding: 4px 10px;
	border-radius: 12px;
	font-size: 0.8em;
	font-weight: 500;
  }
  
  .status-badge.active {
	background: var(--success);
	color: white;
  }
  
  .status-badge.inactive {
	background: var(--warning);
	color: white;
  }
  
  .status-badge.pending {
	background: var(--background-normal);
	color: var(--foreground-normal);
  }
  
  .actions {
	display: flex;
	gap: 8px;
  }
  
  .icon-btn {
	background: transparent;
	border: none;
	cursor: pointer;
	color: var(--foreground-subdued);
	transition: color 0.2s;
  }
  
  .icon-btn:hover {
	color: var(--primary);
  }
  
  .loading-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	padding: 40px;
	color: var(--foreground-subdued);
  }
  
  .empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	padding: 40px;
	color: var(--foreground-subdued);
  }
  
  .pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	margin-top: 24px;
  }
  
  .pagination button {
	background: var(--background-subdued);
	border: 1px solid var(--border-normal);
	border-radius: 4px;
	padding: 8px 12px;
	cursor: pointer;
  }
  
  .pagination button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
  }
  
  /* Sidebar styles */
  .sidebar {
	width: 250px;
	background: var(--background-normal);
	color: var(--foreground-normal);
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: sticky;
	top: 0;
  }
  
  .sidebar-header {
	padding: 20px;
	border-bottom: 1px solid var(--border-subdued);
  }
  
  .sidebar-nav {
	flex: 1;
	padding: 10px 0;
  }
  
  .nav-item {
	display: flex;
	align-items: center;
	padding: 12px 20px;
	color: var(--foreground-subdued);
	text-decoration: none;
	transition: all 0.2s;
  }
  
  .nav-item:hover {
	background: var(--background-subdued);
	color: var(--foreground-normal);
  }
  
  .nav-item.active {
	background: var(--background-subdued);
	color: var(--primary);
	border-left: 3px solid var(--primary);
  }
  
  .sidebar-footer {
	padding: 20px;
	border-top: 1px solid var(--border-subdued);
  }
  
  .user-profile {
	display: flex;
	align-items: center;
	gap: 12px;
  }

.loading-skeleton {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--background-subdued);
  border-radius: 4px;
}

.skeleton-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--background-normal);
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-text {
  height: 16px;
  background: var(--background-normal);
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-text.short {
  width: 120px;
}

.skeleton-text.medium {
  width: 200px;
}

.skeleton-badge {
  width: 80px;
  height: 24px;
  background: var(--background-normal);
  border-radius: 12px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Enhance existing loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  color: var(--foreground-subdued);
}

.loading-state .v-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
  </style>