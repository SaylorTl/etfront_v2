export default [{
        path: '/ui/ui-stations',
        meta: {
            title: '停车场选择'
        },
        name: 'ui-stations',
        component: () =>
            import ( /* webpackChunkName: "locations" */ /* webpackMode: "lazy" */ '../view/ui/stations.vue')
    },
    {
        path: '/ui/ui-buildings',
        meta: {
            title: '楼栋选择'
        },
        name: 'ui-buildings',
        component: () =>
            import ( /* webpackChunkName: "locations" */ /* webpackMode: "lazy" */ '../view/ui/buildings.vue')
    },
    {
        path: '/ui/ui-rooms',
        meta: {
            title: '房间选择'
        },
        name: 'ui-rooms',
        component: () =>
            import ( /* webpackChunkName: "locations" */ /* webpackMode: "lazy" */ '../view/ui/rooms.vue')
    },
    {
        path: '/ui/ui-location-form',
        meta: {
            title: '房间选择'
        },
        name: 'ui-location-form',
        component: () =>
            import ( /* webpackChunkName: "locations" */ /* webpackMode: "lazy" */ '../view/ui/locationForm.vue')
    },
    {
        path: '/ui/ui-jobs',
        meta: {
            title: '房间选择'
        },
        name: 'ui-jobs',
        component: () =>
            import ( /* webpackChunkName: "locations" */ /* webpackMode: "lazy" */ '../view/ui/jobs.vue')
    },
]