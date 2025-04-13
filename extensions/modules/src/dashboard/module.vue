<template>
	  <div class="dashboard-layout">

		    <!-- Sidebar Navigation -->
			<div class="sidebar">
      <div class="sidebar-header">
        <h2>Team Portal</h2>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item active">
          <v-icon name="dashboard" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/teams" class="nav-item">
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
	<div class="dashboard-container dark-theme">
	  <!-- Notification Snackbar -->
	  <v-snackbar v-model="showNotification" :color="notificationColor" timeout="3000">
		hi development{{ notificationMessage }}
	  </v-snackbar>
  
	  <!-- Header with User Info -->
	  <div class="dashboard-header">
		<div class="user-info">
		  <v-avatar v-if="user?.avatar" :src="getAssetUrl(user.avatar)" small />
		  <span class="user-name">{{ user?.first_name }} {{ user?.last_name }}</span>
		</div>
		<h1>Team Workspace Dashboard</h1>
		<div class="team-status">
		  <span class="status-indicator" :class="{'active': teamOnline}"></span>
		  {{ teamOnline ? 'Team Online' : 'Team Offline' }}
		  <span class="online-count">{{ activeMembers }} online</span>
		</div>
	  </div>
  
	  <!-- Stats Cards -->
	  <div class="stats-grid">
		<div class="stat-card">
		  <h3>Active Members</h3>
		  <p class="stat-value">{{ activeMembers }}/{{ totalMembers }}</p>
		</div>
		<div class="stat-card">
		  <h3>Today's Tasks</h3>
		  <p class="stat-value">
			{{ completedTasks }}/{{ totalTasks }}
			<span class="completion-percent">({{ completionRate }}%)</span>
		  </p>
		</div>
		<div class="stat-card">
		  <h3>Current Shift</h3>
		  <p class="stat-value">{{ currentShift }}</p>
		  <p class="shift-time">{{ shiftHours }}</p>
		</div>
	  </div>
  
	  <!-- Check In/Out Section -->
	  <div class="check-section">
		<div class="attendance-status">
		  <span class="status-label">Your Status:</span>
		  <span class="status-badge" :class="currentStatus">
			{{ attendanceStatus }}
		  </span>
		  <span class="last-check">
			{{ lastCheckTime ? `Last: ${lastCheckTime}` : 'Not checked in today' }}
		  </span>
		</div>
		
		<button 
		  v-if="!isCheckedIn" 
		  @click="handleCheckIn" 
		  class="check-btn check-in"
		  :disabled="loading.attendance"
		>
		  <v-icon v-if="loading.attendance" name="refresh" class="spin" />
		  <span v-else>Check In</span>
		</button>
		<button 
		  v-else 
		  @click="handleCheckOut" 
		  class="check-btn check-out"
		  :disabled="loading.attendance"
		>
		  <v-icon v-if="loading.attendance" name="refresh" class="spin" />
		  <span v-else>Check Out</span>
		</button>
	  </div>
  
	  <!-- Team Activity Feed -->
	  <!-- <div class="activity-feed">
		<div class="feed-header">
		  <h2>Recent Activity</h2>
		  <v-button @click="refreshActivities" icon="refresh" small />
		</div>
		<div class="feed-container">
		  <ul v-if="recentActivities.length > 0">
			<li v-for="(activity, index) in recentActivities" :key="index">
			  <div class="activity-avatar">
				<v-avatar v-if="activity.user.avatar" :src="getAssetUrl(activity.user.avatar)" x-small />
			  </div>
			  <div class="activity-content">
				<span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
				<span class="activity-message">
				  <strong>{{ activity.user.first_name }}</strong> 
				  {{ activity.message }}
				</span>
			  </div>
			</li>
		  </ul>
		  <div v-else class="empty-feed">
			No recent activities
		  </div>
		</div>
	  </div> -->
	</div>
</div>
  </template>
  
<script>
  import { useApi, useStores } from '@directus/extensions-sdk';
  import { ref, computed, onMounted } from 'vue';
  import { format, parseISO } from 'date-fns';
  
  export default {
	setup() {
	  const api = useApi();
	  const { useUserStore } = useStores();
	  const userStore = useUserStore();
  
	  // State
	  const user = ref(userStore.currentUser);
	  const isCheckedIn = ref(false);
	  const lastCheckTime = ref(null);
	  const activeMembers = ref(0);
	  const totalMembers = ref(0);
	  const completedTasks = ref(0);
	  const totalTasks = ref(0);
	  const teamOnline = ref(true);
	  const currentShift = ref('Morning (9AM - 5PM)');
	  const shiftHours = ref('09:00 - 17:00');
	  const recentActivities = ref([]);
	  const loading = ref({
		attendance: false
	  });
  
	  // Notification
	  const showNotification = ref(false);
	  const notificationMessage = ref('');
	  const notificationColor = ref('success');
  
	  // Computed
	  const attendanceStatus = computed(() => {
		return isCheckedIn.value ? 'Checked In' : 'Checked Out';
	  });
  
	  const currentStatus = computed(() => {
		return isCheckedIn.value ? 'check-in' : 'check-out';
	  });
  
	  const completionRate = computed(() => {
		return totalTasks.value > 0 
		  ? Math.round((completedTasks.value / totalTasks.value) * 100)
		  : 0;
	  });
  
	  // Methods
	  const showMessage = (message, color = 'success') => {
		notificationMessage.value = message;
		notificationColor.value = color;
		showNotification.value = true;
	  };
  
	  const formatTime = (dateString) => {
  if (!dateString) return '--:--'; // or any placeholder
  return format(parseISO(dateString), 'h:mm a');
};
  
	  const getAssetUrl = (id) => {
		return `${api.defaults.baseURL}/assets/${id}`;
	  };
  
	  const handleCheckIn = async () => {
		try {
		  loading.value.attendance = true;
		  
		  // Record check-in
		  await api.post('/items/attendances', {
			user_id: user.value.id,
			event_type: 'check-in',
		  });
  
		  // Update state
		  isCheckedIn.value = true;
		
  
		  showMessage('Successfully checked in!');
		} catch (error) {
		  console.error('Check-in error:', error);
		  showMessage('Failed to check in', 'error');
		} finally {
		  loading.value.attendance = false;
		}
	  };
  
	  const handleCheckOut = async () => {
		try {
		  loading.value.attendance = true;
		  
		  // Record check-out
		  await api.post('/items/attendances', {
			user_id: user.value.id,
			event_type: 'check-out',
		  });
  
		  // Update state
		  isCheckedIn.value = false;
		  
	
  
		  showMessage('Successfully checked out!');
		} catch (error) {
		  console.log('Check-out error:', error);
		  showMessage('Failed to check out', 'error');
		} finally {
		  loading.value.attendance = false;
		}
	  };
  
	  const refreshActivities = async () => {
		try {
		  const response = await api.get('/items/attendances', {
			params: {
			  sort: '-date_created',
			  limit: 10,
			  fields: ['*', 'user.avatar', 'user.first_name', 'user.last_name'],
			  filter: {
				date_created: {
				  _gte: format(new Date(new Date().setHours(0, 0, 0, 0)), 'yyyy-MM-dd')
				}
			  }
			}
		  });
		  
		  recentActivities.value = response.data.data.map(log => ({
			...log,
			message: log.event_type === 'check-in' ? 'checked in' : 'checked out',
			user: log.user || { first_name: 'Unknown', last_name: 'User' }
		  }));
		} catch (error) {
		  console.error('Error fetching activities:', error);
		}
	  };
  
	  const checkUserAttendance = async () => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const response = await api.get('/items/attendances', {
      params: {
        sort: '-date_created',
        limit: 1,
        fields: ['event_type', 'date_created'],
        filter: {
          user_id: {
            _eq: user.value.id
          },
          date_created: {
            _gte: today
          }
        }
      }
    });

    if (response.data.data.length > 0) {
      const lastLog = response.data.data[0];
      isCheckedIn.value = lastLog.event_type === 'check-in';
      lastCheckTime.value = formatTime(lastLog.date_created);
      
      // Show current status in console for debugging
      console.log(`Current status: ${isCheckedIn.value ? 'Checked In' : 'Checked Out'}`);
      console.log(`Last action at: ${lastCheckTime.value}`);
    } else {
      console.log('No attendance records found for today');
      isCheckedIn.value = false;
      lastCheckTime.value = null;
    }
  } catch (error) {
    console.error('Error checking attendance:', error);
    showMessage('Failed to load attendance data', 'error');
    // Fallback to default state if API fails
    isCheckedIn.value = false;
    lastCheckTime.value = null;
  }
};
  
	  // Lifecycle
	  onMounted(() => {
		checkUserAttendance();
		refreshActivities();
	  });
  
	  return {
		user,
		isCheckedIn,
		lastCheckTime,
		activeMembers,
		totalMembers,
		completedTasks,
		totalTasks,
		teamOnline,
		currentShift,
		shiftHours,
		recentActivities,
		loading,
		attendanceStatus,
		currentStatus,
		completionRate,
		showNotification,
		notificationMessage,
		notificationColor,
		formatTime,
		getAssetUrl,
		handleCheckIn,
		handleCheckOut,
		refreshActivities
	  };
	}
  };
  </script>
  
  <style scoped>
  .dark-theme {
	--bg-primary: #121212;
	--bg-secondary: #1e1e1e;
	--bg-card: #252525;
	--text-primary: #e0e0e0;
	--text-secondary: #a0a0a0;
	--accent-color: #bb86fc;
	--success-color: #03dac6;
	--danger-color: #cf6679;
	--border-color: #333;
	--check-in: rgba(3, 218, 198, 0.1);
	--check-out: rgba(207, 102, 121, 0.1);
  }
  .dashboard-layout {
  display: flex;
  min-height: 100vh;
}
  .dashboard-container {
	background-color: var(--bg-primary);
	color: var(--text-primary);
	padding: 24px;
	min-height: 100%;
  }
  
  .dashboard-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 32px;
	position: relative;
  }
  
  .user-info {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	gap: 8px;
  }
  
  .user-name {
	font-weight: 500;
  }
  
  .team-status {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 8px;
	font-size: 0.9rem;
  }
  
  .online-count {
	color: var(--text-secondary);
	font-size: 0.8rem;
  }
  
  .status-indicator {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #555;
  }
  
  .status-indicator.active {
	background-color: var(--success-color);
  }
  
  .stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 16px;
	margin-bottom: 24px;
  }
  
  .stat-card {
	background: var(--bg-card);
	color: var(--text-primary);
	border: 1px solid var(--border-color);
	border-radius: 8px;
	padding: 16px;
	text-align: center;
  }
  
  .stat-card h3 {
	margin: 0 0 8px 0;
	font-size: 1rem;
	font-weight: 500;
	color: var(--text-secondary);
  }
  
  .stat-value {
	font-size: 1.5rem;
	font-weight: 600;
	margin: 0;
	color: var(--accent-color);
  }
  
  .completion-percent {
	font-size: 0.9rem;
	color: var(--text-secondary);
  }
  
  .shift-time {
	font-size: 0.9rem;
	margin: 4px 0 0 0;
	color: var(--text-secondary);
  }
  
  .check-section {
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: 8px;
	padding: 16px;
	margin-bottom: 24px;
	text-align: center;
  }
  
  .attendance-status {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin-bottom: 16px;
  }
  
  .status-label {
	color: var(--text-secondary);
  }
  
  .status-badge {
	padding: 4px 12px;
	border-radius: 16px;
	font-weight: 500;
	font-size: 0.9rem;
  }
  
  .status-badge.check-in {
	background-color: var(--check-in);
	color: var(--success-color);
  }
  
  .status-badge.check-out {
	background-color: var(--check-out);
	color: var(--danger-color);
  }
  
  .last-check {
	font-size: 0.8rem;
	color: var(--text-secondary);
  }
  
  .check-btn {
	padding: 12px 24px;
	border: none;
	border-radius: 4px;
	font-size: 1rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
	min-width: 120px;
  }
  
  .check-in {
	background-color: var(--success-color);
	color: #000;
  }
  
  .check-out {
	background-color: var(--danger-color);
	color: #000;
  }
  
  .check-btn:hover:not(:disabled) {
	opacity: 0.9;
	transform: translateY(-1px);
  }
  
  .check-btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
  }
  
  .activity-feed {
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: 8px;
	padding: 16px;
  }
  
  .feed-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
  }
  
  .feed-header h2 {
	margin: 0;
	font-size: 1.2rem;
  }
  
  .feed-container {
	max-height: 300px;
	overflow-y: auto;
  }
  
  .loading-activities {
	display: flex;
	justify-content: center;
	padding: 20px;
  }
  
  .activity-feed ul {
	list-style: none;
	padding: 0;
	margin: 0;
  }
  
  .activity-feed li {
	padding: 12px 0;
	display: flex;
	gap: 12px;
	align-items: center;
  }
  
  .activity-feed li:not(:last-child) {
	border-bottom: 1px solid var(--border-color);
  }
  
  .activity-avatar {
	flex-shrink: 0;
  }
  
  .activity-content {
	display: flex;
	flex-direction: column;
  }
  
  .activity-time {
	font-size: 0.7rem;
	color: var(--text-secondary);
	margin-bottom: 2px;
  }
  
  .activity-message {
	font-size: 0.9rem;
  }
  
  .empty-feed {
	text-align: center;
	padding: 20px;
	color: var(--text-secondary);
  }
  .dashboard-layout {
  display: flex;
  min-height: 100vh;
}

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

.nav-item .v-icon {
  margin-right: 10px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #333;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dashboard-container {
  flex: 1;
  padding: 24px;
}
  </style>