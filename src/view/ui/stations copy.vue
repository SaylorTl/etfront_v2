<template>
    <div class="ui-stations">
        <div class="ui-stations-search" v-if="step !== 4">
            <x-xinput class="search-input" v-model="search" :placeholder="placeholder" novalidate :show-clear="false"
                placeholder-align="left" :debounce="1000" @on-change="inputChange">
                <div slot="right" class="ui-stations-input-close" v-if="!!search" @click="clearSearch"><i
                        class="fa fa-close"></i></div>
            </x-xinput>
        </div>
        <div class="ui-stations-scroll" v-if="step === 1">
            <x-scroller v-if="!nostations" lock-x scrollbar-y height="-49" ref="scroller" :pullup-config="upConfig"
                :use-pullup="true" @on-pullup-loading="pullUp">
                <x-group>
                    <x-radio :options="stations" @on-change="stationChange"></x-radio>
                </x-group>
            </x-scroller>
            <div v-if="nostations" class="ui-nostations">无法获取相关停车场信息，请搜索停车场</div>
        </div>
        <div class="ui-stations-buildings-wrapper" v-if="step === 2">
            <div class="ui-stations-links">
                <div class="ui-stations-links-item" @click="changeStep(1)">{{stationInfo.stationName}}</div>
            </div>
            <div class="ui-stations-buildings">
                <x-group>
                    <x-radio :options="calBuildings" @on-change="buildingChange"></x-radio>
                </x-group>
                <div v-if="nobuildings" class="ui-nostations">无相关楼栋信息</div>
            </div>

            <div class="ui-stations-btn__addbuilding" @click="handleAdd">
                +增加楼栋信息
            </div>
        </div>
        <div class="ui-stations-buildings-wrapper" v-if="step === 3">
            <div class="ui-stations-links">
                <div class="ui-stations-links-item" @click="changeStep(1)">{{stationInfo.stationName}}</div>
                <div class="ui-stations-links-item" @click="changeStep(2)">{{ " / " + buildingInfo.buildName}}</div>
            </div>
            <div class="ui-stations-buildings">
                <x-group>
                    <x-radio :options="calRooms" @on-change="roomChange"></x-radio>
                </x-group>
                <div v-if="norooms" class="ui-nostations">无相关房间信息</div>
            </div>

            <div class="ui-stations-btn__addbuilding" @click="handleAdd">
                +增加房间信息
            </div>
        </div>
        <div class="ui-stations-buildings-wrapper" v-if="step === 4">
            <div class="ui-stations-links">
                <div class="ui-stations-links-item" @click="changeStep(1)">{{stationInfo.stationName}}</div>
            </div>

            <x-xinput title="楼栋名称：" v-model="form.build_name" placeholder="楼栋名称（如：8楼、天星阁、翠竹园等等）" novalidate
                :disabled="!isEdit" :show-clear="true" placeholder-align="left"></x-xinput>

            <x-xinput title="单元名称：" v-model="form.unitname" placeholder="单元名称（如：3单元、A单元）" novalidate :show-clear="true"
                placeholder-align="left"></x-xinput>

            <x-xinput title="楼层名称：" v-model="form.floor" placeholder="楼层（如：8楼、16楼）" novalidate :show-clear="true"
                placeholder-align="left"></x-xinput>

            <x-xinput title="房间名称：" v-model="form.room_name" placeholder="房间号（如：502、101）" novalidate :show-clear="true"
                placeholder-align="left"></x-xinput>

            <div class="ui-stations-form-btn">
                <x-xbutton @click.native="submit">下一步</x-xbutton>
            </div>
        </div>
        <div class="ui-stations-buildings-wrapper" v-if="step === 5">
            <div class="ui-stations-links">
                <div class="ui-stations-links-item" @click="changeStep(1)">{{stationInfo.stationName}}</div>
                <div class="ui-stations-links-item" @click="changeStep(2)">{{ " / " + buildingInfo.buildName}}</div>
                <div class="ui-stations-links-item" @click="changeStep(3)">{{ " / " + roomInfo.roomName}}</div>
            </div>
            <div class="ui-stations-buildings">
                <x-group>
                    <x-radio :options="calJobs" @on-change="jobsChange"></x-radio>
                </x-group>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
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
            buildings: [],
            nobuildings: true,
            rooms: [],
            norooms: true,
            stationInfo: {},
            buildingInfo: {},
            roomInfo: {},
            type: "",
            step: 1,
            isEdit: true,
            form: {
                build_name: "",
                unitname: "",
                floor: "",
                room_name: ""
            },
            bindType: "",
            jobs: [],
            jobInfo: {}
        };
    },
    computed: {
        ...mapState(["appType", "locationInfo"]),
        calBuildings() {
            return this.buildings.filter(item => {
                return (
                    item.value
                        .toLowerCase()
                        .indexOf(this.search.toLowerCase()) != -1
                );
            });
        },
        calRooms() {
            return this.rooms.filter(item => {
                return (
                    item.value
                        .toLowerCase()
                        .indexOf(this.search.toLowerCase()) != -1
                );
            });
        },
        calJobs() {
            return this.jobs.filter(item => {
                return (
                    item.value
                        .toLowerCase()
                        .indexOf(this.search.toLowerCase()) != -1
                );
            });
        }
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
            if (!!this.locationInfo) {
                const { longitude, latitude } = this.locationInfo;
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
            }
        },
        inputChange(value) {
            if (this.step === 1) {
                this.page = 1;
                this.showStations("", value, this.page, this.pagesize);
                this.$nextTick(() => {
                    if (this.$refs.scroller) {
                        this.$refs.scroller.reset({ top: 0 });
                    }
                });
            }
        },
        clearSearch() {
            this.search = "";
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
                this.step = 2;
                this.search = "";
                this.placeholder = "搜索楼栋";
                this.showBuildings();
            }
        },
        showBuildings() {
            this.$loading.show();
            utils
                .gateway(utils.api.getBuildingByStation, {
                    station_id: this.stationInfo.station
                })
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
                                key: item.build_id,
                                value: item.build_name,
                                building: item.building
                            };
                        });
                        this.buildings = temp;
                        this.nobuildings = false;
                    } else {
                        this.nobuildings = true;
                        this.buildings = [];
                    }
                    console.log("buildings:", res);
                });
        },
        buildingChange(event) {
            console.log("building:", event);
            let building = this.buildings.filter(item => item.key === event);
            this.buildingInfo = {
                buildId: building[0].key,
                buildName: building[0].value,
                building: building[0].building
            };
            this.form.build_name = this.buildingInfo.buildName;
            this.isEdit = false;
            this.step = 3;
            this.placeholder = "搜索房间";
            this.showRooms();
        },
        showRooms() {
            this.$loading.show();
            utils
                .gateway(utils.api.getRoomByBuilding, {
                    building_id: this.buildingInfo.buildId
                })
                .then(res => {
                    this.$loading.hide();
                    if (
                        res.code === 0 &&
                        !!res.content &&
                        !!res.content.lists
                    ) {
                        let temp = res.content.lists.map(item => {
                            return {
                                key: item.room_id,
                                value: item.room_name,
                                unit: item.unit,
                                unitname: item.unitname,
                                floor: item.floor,
                                tenement: item.tenement
                            };
                        });
                        this.rooms = temp;
                        this.norooms = false;
                    } else {
                        this.norooms = true;
                        this.rooms = [];
                    }
                });
        },
        roomChange(event) {
            let room = this.rooms.filter(item => item.key === event);
            this.roomInfo = {
                roomId: room[0].key,
                roomName: room[0].value
            };
            this.step = 5;
            setTimeout(() => {
                this.jobs = [
                    {
                        key: "owner",
                        value: "业主"
                    },
                    {
                        key: "owner_family",
                        value: "业主家属"
                    },
                    {
                        key: "tenant",
                        value: "租客"
                    },
                    {
                        key: "staff",
                        value: "员工"
                    },
                    {
                        key: "other",
                        value: "其他"
                    }
                ];
            }, 500);

            this.placeholder = "搜索申请人身份";
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
        },
        changeStep(item) {
            this.step = parseInt(item);
            if (this.step === 1) {
                this.stationInfo = {};
            } else if (this.step === 2) {
                this.buildings = [];
                this.buildingInfo = {};
                this.showBuildings();
            } else if (this.step === 3) {
                this.rooms = [];
                this.roomInfo = {};
                this.showRooms();
            }
            this.search = "";
        },
        handleAdd() {
            this.step = 4;
        },
        submit() {
            if (!this.form.build_name) {
                this.$vux.toast.text("请输入楼栋信息", "middle");
                return false;
            } else if (!this.form.floor) {
                this.$vux.toast.text("请输入楼层信息", "middle");
                return false;
            } else if (!this.form.room_name) {
                this.$vux.toast.text("请输入房间号", "middle");
                return false;
            } else {
                utils
                    .gateway(utils.api.addBuildingAndRoom, {
                        station_id: this.stationInfo.station,
                        ...this.form
                    })
                    .then(result => {
                        if (result.code === 0) {
                            this.roomInfo = {
                                roomId: result.content.room_id,
                                roomName: this.form.room_name
                            };
                            this.form = {
                                build_name: "",
                                unitname: "",
                                floor: "",
                                room_name: ""
                            };
                            this.step = 5;
                            this.placeholder = "搜索申请人身份";
                        } else {
                            this.$vux.toast.show({
                                width: "3.6rem",
                                type: "warn",
                                text: "添加出错",
                                time: 3000
                            });
                        }
                    });
            }
        },
        jobsChange(event) {
            let job = this.jobs.filter(item => item.key === event);
            this.jobInfo = {
                jobId: job[0].key,
                jobName: job[0].value
            };
            this.$router.push({
                name: this.urlName,
                query: {
                    bindType: this.bindType,
                    stationId: this.stationInfo.station,
                    buildId: this.buildingInfo.buildId,
                    roomId: this.roomInfo.roomId,
                    jobId: this.jobInfo.jobId,
                    plate: this.plate
                }
            });
        }
    }
};
</script>