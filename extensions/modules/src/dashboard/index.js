import ModuleComponent from './module.vue';

export default {
	id: 'dashboard',
	name: 'dashboard',
	icon: 'dashboard',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
};
