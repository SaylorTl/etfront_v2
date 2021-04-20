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
                <div class="ui-stations-links-item" >{{stationInfo.stationName}}</div>
                <div class="ui-stations-links-item" >{{ " / " + buildingInfo.buildName}}</div>
                <div class="ui-stations-links-item" >{{ " / " + roomInfo.roomName}}</div>
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
export default {
    name: "stations",
    props: {},
    components: {},
    data() {
        return {
            search: "",
            placeholder: "搜索申请人身份",
            urlName:"",
            stationInfo: {},
            buildingInfo: {},
            roomInfo: {},
            jobInfo: {},
            jobs: [
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
                ]
            
        };
    },
    computed: {
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
    created() {
        const {
            plate,
            urlName,
            type,
            bindType,
            station,
            stationName,
            buildId,
            buildName,
            roomId,
            roomName
        } = this.$route.query;
        this.urlName = urlName || '';
        this.stationInfo = { station, stationName };
        this.buildingInfo = { buildId, buildName };
        this.roomInfo = {roomId,roomName};
    },
    beforeMount() {},
    mounted() {},
    methods: {
        clearSearch() {
            this.search = "";
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
                    ...this.$route.query,
                    ...this.jobInfo
                }
            });
        }
    }
};
</script>