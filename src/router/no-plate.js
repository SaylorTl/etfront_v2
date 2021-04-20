export default [{
        path: '/p/q',
        name: 'p_q',
        redirect: '/no-plate'
    },
    {
        path: '/p/q/:station_id',
        name: 'p_q_s',
        redirect: to => {
            const { hash, params, query } = to
            return {
                path: '/no-plate',
                query: {
                    station_id: params.station_id
                }
            }
        }
    },
    {
        path: '/no-plate',
        name: 'p_q_n',
        meta: {
            title: ''
        },
        component: () =>
            import ( /* webpackChunkName: "no-plate" */ /* webpackMode: "lazy" */ '../view/noPlate/noPlate.vue')
    },
    {
        path: '/p/qr/:device_id',
        name: 'p_q_d',
        redirect: '/no-plate/:device_id'
    },
    {
        path: '/no-plate/:device_id',
        name: 'no-plate',
        component: () =>
            import ( /* webpackChunkName: "no-plate" */ /* webpackMode: "lazy" */ '../view/noPlate/noPlate.vue')
    }
]