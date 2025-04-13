import ModuleComponent from './module.vue';

export default {
	id: 'sidebar',
	name: 'sidebar',
	icon: 'box',
	routes: [
		{
			path: '',
			component: ModuleComponent,
			meta: { 
				layout: 'sidebar' // Enable sidebar layout
			  }
		},
	],
};
