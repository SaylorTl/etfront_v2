import axios from 'axios';
const JSONbig = require('json-bigint');
const $axios = axios.create({
    transformRequest: [function(data) {
        var token = window.localStorage.getItem('access_token') ? window.localStorage.getItem('access_token') : '';
        var now_time = parseInt(new Date().getTime() / 1000);
        var app_id = "G8b875FDhzW0";
        var param = "app_id=" + app_id + "&method=" + data.method + "&format=json&charset=utf8&timestamp=" + now_time + "&token=" + token + "&biz_content=";
        if (data.biz_content) {
            param = param + JSON.stringify(data.biz_content);
        }
        return param
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    transformResponse: [function(res) {
        try {
            res = JSONbig.parse(res);
        } catch (error) {
            throw new Error(error)
        }
        return res;
    }]
});

export default $axios;