<template>
    <div class="ui-stations">
        <div class="ui-stations-search">
            <x-xinput class="search-input" v-model="search" :placeholder="placeholder" novalidate :show-clear="false"
                placeholder-align="left" :debounce="1000">
                <div slot="right" class="ui-stations-input-close" v-if="!!search" @click="clearSearch"><i
                        class="fa fa-close"></i></div>
            </x-xinput>
        </div>
        <div class="ui-stations-buildings-wrapper">
            <div class="ui-stations-links">
                <div class="ui-stations-links-item">{{stationInfo.stationName}}</div>
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
            placeholder: "搜索楼栋",
            buildings: [],
            nobuildings: true,
            stationInfo: {
                station: "",
                stationName: ""
            },
            buildingInfo: {}
        };
    },
    computed: {
        calBuildings() {
            return this.buildings.filter(item => {
                return (
                    item.value
                        .toLowerCase()
                        .indexOf(this.search.toLowerCase()) != -1
                );
            });
        }
    },
    beforeCreate() {},
    created() {
        const {
            plate,
            urlName,
            type,
            bindType,
            station,
            stationName
        } = this.$route.query;
        this.stationInfo = { station, stationName };
        this.showBuildings();
    },
    beforeMount() {},
    mounted() {},
    methods: {
        clearSearch() {
            this.search = "";
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
                buildName: building[0].value
            };
            this.$router.push({
                name: "ui-rooms",
                query: {
                    ...this.$route.query,
                    ...this.buildingInfo
                }
            });
        },
        handleAdd() {
            if (this.buildingInfo.buildId) {
                this.$router.push({
                    name: "ui-location-form",
                    query: {
                        ...this.$route.query,
                        ...this.buildingInfo
                    }
                });
            } else {
                this.$router.push({
                    name: "ui-location-form",
                    query: {
                        ...this.$route.query
                    }
                });
            }
        }
    }
};
</script>