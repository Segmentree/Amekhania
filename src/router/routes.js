const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/reminders-list',
        name: 'RemindersList',
        component: () => import('pages/RemindersList.vue'),
      },
      {
        path: '/notes-list',
        name: 'NotesList',
        component: () => import('pages/NotesList.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
