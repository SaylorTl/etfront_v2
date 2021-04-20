export default {
    setClientType(state, options) {
        state.clientType = options;
    },
    setLoginStatus(state, options) {
        state.isLogin = options;
    },
    setLoading(state, options) {
        state.isLoading = options;
    },
    setLoginInfo(state, options) {
        let data = Object.assign({}, state.loginInfo, options)
        state.loginInfo = data;
    },
    setUserInfo(state, options) {
        let data = Object.assign({}, state.userInfo, options)
        state.userInfo = data;
    },
    setCachePages(state, name) {
        let i = state.cachePages.findIndex(item => {
            return item === name;
        })
        if (!~i) {
            state.cachePages.push(name);
        }
    },
    removeCachePage(state, name) {
        let i = state.cachePages.findIndex(item => {
            return item === name;
        })
        if (!!~i) {
            state.cachePages.splice(i, 1);
        }

    },
    setCurrentRoute(state, options) {
        state.currRoute = options;
    },
    setLocationInfo(state, options) {
        state.locationInfo = options;
    },
    setAppType(state, options) {
        state.appType = options;
    }
}