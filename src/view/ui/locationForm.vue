<template>
    <div class="ui-stations">
        <div class="ui-stations-buildings-wrapper">
            <div class="ui-stations-links">
                <div class="ui-stations-links-item">{{stationInfo.stationName}}</div>
            </div>
            <div class="ui-stations-form">
                <x-xinput title="楼栋名称：" v-model="form.build_name" placeholder="楼栋名称（如：8楼、天星阁、翠竹园等等）" novalidate
                    :disabled="!isEdit" :show-clear="false" placeholder-align="left">
                    <div slot="right" class="ui-stations-input-close" v-if="!!form.build_name && isEdit" @click="clearSearch('build_name')"><i class="fa fa-close"></i></div>   
                </x-xinput>
                <x-xinput title="单元名称：" v-model="form.unitname" placeholder="单元名称（如：3单元、A单元）" novalidate
                    :show-clear="false" placeholder-align="left">
                    <div slot="right" class="ui-stations-input-close" v-if="!!form.unitname" @click="clearSearch('unitname')"><i class="fa fa-close"></i></div>
                </x-xinput>
                <x-xinput title="楼层名称：" v-model="form.floor" placeholder="楼层（必须填写整，数如：8、16）" novalidate :show-clear="false"
                    placeholder-align="left">
                    <div slot="right" class="ui-stations-input-close" v-if="!!form.floor" @click="clearSearch('floor')"><i class="fa fa-close"></i></div>
                </x-xinput>
                <x-xinput title="房间名称：" v-model="form.room_name" placeholder="房间号（如：502、101）" novalidate
                    :show-clear="false" placeholder-align="left">
                    <div slot="right" class="ui-stations-input-close" v-if="!!form.room_name" @click="clearSearch('room_name')"><i class="fa fa-close"></i></div>
                </x-xinput>
                <div class="ui-stations-form-btn">
                    <x-xbutton @click.native="submit">下一步</x-xbutton>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "../../utils/utils";
import { mapState } from "vuex";
export default {
    name: "locationForm",
    props: {},
    components: {},
    data() {
        return {
            stationInfo: {},
            buildingInfo: {},
            roomInfo: {},
            isEdit: true,
            form: {
                build_name: "",
                unitname: "",
                floor: "",
                room_name: ""
            }
        };
    },
    computed: {},
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
        if (!!buildId && !!buildName) {
            this.buildingInfo = { buildId, buildName };
            this.form.build_name = buildName;
            this.isEdit = false;
        }
    },
    beforeMount() {},
    mounted() {},
    methods: {
        clearSearch(flag){
            this.form[flag] = "";
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
                let { build_name, unitname, floor, room_name } = this.form;
                if (!!this.buildingInfo.buildId) {
                    this.form = {
                        build_name: parseInt(this.buildingInfo.buildId),
                        unitname,
                        floor,
                        room_name
                    };
                }
                utils
                    .gateway(utils.api.addBuildingAndRoom, {
                        station_id: this.stationInfo.station,
                        ...this.form
                    })
                    .then(result => {
                        if (result.code === 0) {
                            let temp = result.content;
                            this.roomInfo = {
                                roomId: temp.room_id,
                                roomName: this.form.room_name
                            };
                            if (!this.buildingInfo.buildId) {
                                this.buildingInfo = {
                                    buildId: temp.build_id,
                                    buildName: this.form.build_name
                                };
                                this.form = {
                                    build_name: "",
                                    unitname: "",
                                    floor: "",
                                    room_name: ""
                                };
                                this.$router.push({
                                    name: "ui-jobs",
                                    query: {
                                        ...this.$route.query,
                                        ...this.buildingInfo,
                                        ...this.roomInfo
                                    }
                                });
                            } else {
                                this.form = {
                                    unitname: "",
                                    floor: "",
                                    room_name: ""
                                };
                                this.$router.push({
                                    name: "ui-jobs",
                                    query: {
                                        ...this.$route.query,
                                        ...this.roomInfo
                                    }
                                });
                            }
                        } else {
                            this.$vux.toast.show({
                                width: "3.6rem",
                                type: "warn",
                                text: result.message,
                                time: 3000
                            });
                        }
                    });
            }
        }
    }
};
</script>