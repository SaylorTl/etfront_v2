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
                <div class="ui-stations-links-item">{{ " / " + buildingInfo.buildName}}</div>
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
    </div>
</template>
<script>
import utils from "../../utils/utils";
export default {
    name: "rooms",
    props: {},
    components: {},
    data() {
        return {
            search: "",
            placeholder: "搜索房间",
            rooms: [],
            norooms: true,
            stationInfo: {},
            buildingInfo: {},
            roomInfo:{}
        };
    },
    computed: {
        calRooms() {
            return this.rooms.filter(item => {
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
            stationName,
            buildId,
            buildName
        } = this.$route.query;
        this.stationInfo = { station, stationName };
        this.buildingInfo = { buildId, buildName };
        this.showRooms();
    },
    beforeMount() {},
    mounted() {},
    methods: {
        clearSearch() {
            this.search = "";
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
            this.$router.push({
                name: "ui-jobs",
                query: {
                    ...this.$route.query,
                    ...this.roomInfo
                }
            });
        },
        handleAdd() {
            if (this.buildingInfo.buildId && this.roomInfo.roomId) {
                this.$router.push({
                    name: "ui-location-form",
                    query: {
                        ...this.$route.query,
                        ...this.roomInfo
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