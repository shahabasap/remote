<template>
	<div class="team-layout">
	  <!-- Sidebar Navigation -->
	  <div class="sidebar">
		<div class="sidebar-header">
		  <h2>Team Portal</h2>
		</div>
		<nav class="sidebar-nav">
		  <router-link to="/dashboard" class="nav-item ">
			<v-icon name="dashboard" />
			<span>Dashboard</span>
		  </router-link>
		  <router-link to="/teams" class="nav-item active">
			<v-icon name="groups" />
			<span>Teams</span>
		  </router-link>
		  <router-link to="/people" class="nav-item">
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
	
	  <div class="team-container dark-theme">
		<!-- Teams Section -->
		<div class="section-card">
		  <div class="section-header">
			<h2>Teams Layout</h2>
			<button @click="refreshTeams" class="refresh-btn">
			  <span class="refresh-icon">↻</span> Refresh
			</button>
		  </div>
  
		  <!-- Table View -->
		  <div class="teams-table-container">
			<table class="teams-table">
			  <thead>
				<tr>
				  <th>Team Name</th>
				  <th>Description</th>
				  <th>Status</th>
				
				</tr>
			  </thead>
			  <tbody>
				<tr v-for="team in teams" :key="team.id">
				  <td>{{ team.teams || 'N/A' }}</td>
				  <td class="description-cell" :title="team.description">
					{{ truncateDescription(team.description) }}
				  </td>
				  <td>
					<span class="status-chip" :class="team.status === 'active' ? 'active' : 'inactive'">
					  {{ team.status || 'inactive' }}
					</span>
				  </td>
				
				</tr>
			  </tbody>
			</table>
		  </div>
  
		  <!-- Loading State -->
		  <div v-if="loading.teams" class="loading-state">
			<div class="spinner"></div>
			<span>Loading teams...</span>
		  </div>
  
		  <!-- Empty State -->
		  <div v-if="!loading.teams && teams.length === 0" class="empty-state">
			No teams found
		  </div>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import { useApi, useStores } from '@directus/extensions-sdk';
  import { ref, onMounted } from 'vue';
  
  export default {
	setup() {
	  const api = useApi();
	  const { useUserStore } = useStores();
	  const userStore = useUserStore();
  
	  // State
	  const user = ref(userStore.currentUser);
	  const teams = ref([]);
	  const loading = ref({ teams: false });
  
	  // Methods
	  const getAssetUrl = (id) => {
		return id ? `${api.defaults.baseURL}/assets/${id}` : '';
	  };
  
	  const truncateDescription = (text, maxLength = 100) => {
		if (!text) return '-';
		return text.length > maxLength 
		  ? text.substring(0, maxLength) + '...' 
		  : text;
	  };
  
	  const fetchTeams = async () => {
		try {
		  loading.value.teams = true;
		  const teamsResponse = await api.get('/items/teams', {
			params: { fields: ['id', 'teams', 'description', 'status'] }
		  });
		  teams.value = teamsResponse?.data?.data || [];
		} catch (error) {
		  console.error('Error fetching teams:', error);
		  teams.value = []; 
		} finally {
		  loading.value.teams = false;
		}
	  };
  
	  const refreshTeams = () => fetchTeams();
	  const editTeam = (team) => console.log('Editing team:', team);
	  const confirmDelete = (team) => console.log('Deleting team:', team);
  
	  onMounted(fetchTeams);
  
	  return {
		user,
		teams,
		loading,
		getAssetUrl,
		truncateDescription,
		refreshTeams,
		editTeam,
		confirmDelete
	  };
	}
  };
  </script>
  
  <style scoped>

.team-container {
  flex: 1;
  padding: 24px;
}
.team-layout {
  display: flex;
  min-height: 100vh;
}
  .teams-table-container {
	margin-top: 20px;
	border: 1px solid var(--border-color);
	border-radius: 8px;
	overflow: auto;
	background: var(--bg-card);
  }
  
  .teams-table {
	width: 100%;
	border-collapse: collapse;
	color: var(--text-primary);
  }
  
  .teams-table th {
	background-color: var(--bg-secondary);
	padding: 12px 16px;
	text-align: left;
	position: sticky;
	top: 0;
  }
  
  .teams-table td {
	padding: 10px 16px;
	border-bottom: 1px solid var(--border-color);
  }
  
  .description-cell {
	max-width: 300px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
  }
  
  .status-chip {
	display: inline-block;
	padding: 4px 10px;
	border-radius: 12px;
	font-size: 0.8em;
  }
  
  .status-chip.active {
	background-color: #4CAF50;
	color: white;
  }
  
  .status-chip.inactive {
	background-color: #FF9800;
	color: white;
  }
  
  .action-btn {
	padding: 6px 12px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.9em;
  }
  
  .action-btn.edit {
	background-color: #2196F3;
	color: white;
  }
  
  .action-btn.delete {
	background-color: #F44336;
	color: white;
  }
  
  .refresh-btn {
	padding: 8px 16px;
	background-color: var(--bg-secondary);
	color: var(--text-primary);
	border: 1px solid var(--border-color);
	border-radius: 4px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
  }
  
  .loading-state {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 40px;
	color: var(--text-secondary);
  }
  
  .empty-state {
	padding: 40px;
	color: var(--text-secondary);
	text-align: center;
  }
  
  .section-card {
	background: var(--bg-card);
	padding: 20px;
	border-radius: 8px;
	margin-bottom: 24px;
  }
  
  .section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
  }
  
  /* Sidebar styles */
  .sidebar {
	width: 250px;
	background: #1a1a1a;
	color: white;
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: sticky;
	top: 0;
  }
  
  .sidebar-header {
	padding: 20px;
	border-bottom: 1px solid #333;
  }
  
  .sidebar-nav {
	flex: 1;
	padding: 10px 0;
  }
  
  .nav-item {
	display: flex;
	align-items: center;
	padding: 12px 20px;
	color: #aaa;
	text-decoration: none;
	transition: all 0.2s;
  }
  
  .nav-item:hover {
	background: #252525;
	color: white;
  }
  
  .nav-item.active {
	background: #333;
	color: white;
	border-left: 3px solid var(--accent-color);
  }
  
  .sidebar-footer {
	padding: 20px;
	border-top: 1px solid #333;
  }
  </style>