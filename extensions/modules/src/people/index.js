import ModuleComponent from './module.vue';

export default {
	id: 'people',
	name: 'People',
	icon: 'people',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
};
