<template>
    <div class="ui-stations">
        <div class="ui-stations-search">
            <x-xinput class="search-input" v-model="search" :placeholder="placeholder" novalidate :show-clear="false" placeholder-align="left" :debounce="1000" @on-change="inputChange">
                <div slot="right" class="ui-stations-input-close" v-if="!!search" @click="clearSearch"><i class="fa fa-close"></i></div>
            </x-xinput>
        </div>
        <div class="ui-stations-scroll">
            <x-scroller v-if="!nostations" lock-x scrollbar-y height="-49" ref="scroller" :pullup-config="upConfig" :use-pullup="true" @on-pullup-loading="pullUp">
                <x-group>
                    <x-radio :options="stations" @on-change="stationChange"></x-radio>
                </x-group>
            </x-scroller>
            <div v-if="nostations" class="ui-nostations">无法获取相关停车场信息，请搜索停车场</div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
export default {
    name: "stations",
    props: {},
    components: {},
    data() {
        return {
            search: "",
            placeholder: "搜索停车场",
            upConfig: {
                upContent: "",
                downContent: "释放后加载"
            },
            plate: "",
            total: 0,
            page: 1,
            pagesize: 11,
            stations: [],
            nostations: true,
            stationInfo: {},
            type: "",
            bindType: ""
        };
    },
    beforeCreate() {},
    created() {},
    beforeMount() {},
    mounted() {
        this.getLocation();
        const { plate, urlName, type, bindType } = this.$route.query;
        if (!!plate) {
            this.plate = plate;
        }
        if (!!urlName) {
            this.urlName = urlName;
        }
        if (!!type) {
            this.type = type;
        }
        if (!!bindType) {
            this.bindType = bindType;
        }
    },
    methods: {
        getLocation() {
            const { longitude, latitude } = this.$store.state.locationInfo;
            let params = {
                longitude,
                latitude,
                divisor: 0.5
            };
            utils
                .gateway(utils.api.getNeighborhoodStation, params)
                .then(res => {
                    if (
                        res.code === 0 &&
                        !!res.content &&
                        !!res.content.lists
                    ) {
                        let result = res.content.lists;
                        let temp = result.map(item => {
                            return {
                                key: item.id,
                                value: item.name,
                                address: item.address
                            };
                        });
                        this.stations = temp;
                        this.nostations = false;
                    } else {
                        this.nostations = true;
                        this.stations = [];
                    }
                });
        },
        inputChange(value) {
            this.page = 1;
            this.showStations("", value, this.page, this.pagesize);
            this.$nextTick(() => {
                if (this.$refs.scroller) {
                    this.$refs.scroller.reset({ top: 0 });
                }
            });
        },
        clearSearch() {
            this.search = "";
            this.showStations("", "", this.page, this.pagesize);
        },
        showStations: function(city, station, page, pagesize) {
            let currPage = this.page;
            this.$loading.show();
            let params = {
                station_name: station,
                city_id: city,
                page: page,
                pagesize: pagesize
            };
            utils
                .gateway(utils.api.getStationByCityAndsName, params)
                .then(res => {
                    this.$loading.hide();
                    if (
                        res.code === 0 &&
                        !!res.content &&
                        !!res.content.lists &&
                        res.content.lists.length > 0
                    ) {
                        let result = res.content;
                        let temp = result.lists.map(item => {
                            return {
                                key: item.station_id,
                                value: item.station_name,
                                address: item.address
                            };
                        });
                        let total =
                            result.total % pagesize === 0
                                ? parseInt(result.total / pagesize)
                                : parseInt(result.total / pagesize) + 1;
                        //当前页为1时直接赋值，否则附加
                        if (currPage === 1) {
                            this.stations = temp;
                        } else {
                            this.stations.push(...temp);
                        }
                        this.nostations = false;
                        this.total = total;
                    } else {
                        this.nostations = true;
                        this.stations = [];
                    }
                });
        },
        stationChange(event) {
            let station = this.stations.filter(item => item.key === event);
            console.log("event:", station);
            this.stationInfo = {
                station: station[0].key,
                stationName: station[0].value,
                address: station[0].address
            };
            if (this.type === "station") {
                this.$router.push({
                    name: this.urlName,
                    query: {
                        stationInfo: JSON.stringify(this.stationInfo),
                        plate: this.plate
                    }
                });
            } else {
                this.$router.push({
                    name: "ui-buildings",
                    query: {
                        ...this.$route.query,
                        station: this.stationInfo.station,
                        stationName: this.stationInfo.stationName
                    }
                });
            }
        },
        pullUp() {
            this.page = this.page + 1;
            if (this.page > this.total) {
                this.$vux.toast.text("真的没有了", "middle");
                this.page = this.total;
                this.$nextTick(() => {
                    this.$refs.scroller.donePullup();
                    this.$refs.scroller.reset();
                });
            } else {
                this.showStations("", this.search, this.page, this.pagesize);
                this.$nextTick(() => {
                    this.$refs.scroller.donePullup();
                    this.$refs.scroller.reset();
                });
            }
        }
    }
};
</script>