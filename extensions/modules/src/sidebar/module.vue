<template>
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
     
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
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

</style>
