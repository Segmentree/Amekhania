const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requireApiKey: true,
        },
      },
      {
        path: '/reminders-list',
        name: 'RemindersList',
        component: () => import('pages/RemindersList.vue'),
        meta: {
          requireApiKey: true,
        },
      },
      {
        path: '/notes-list',
        name: 'NotesList',
        component: () => import('pages/NotesList.vue'),
        meta: {
          requireApiKey: true,
        },
      },
      {
        path: '/tools-lab',
        name: 'ToolsLab',
        component: () => import('pages/ToolsLab.vue'),
      },
      {
        path: '/user-settings',
        name: 'UserSettings',
        component: () => import('pages/SettingsPage.vue'),
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
