<template>
    <div class="page-one-card-pass">
        <div>
            <img class="page-one-card-pass-img" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/home_ad01.png" alt="">
        </div>
        <my-table :lists="lists"></my-table>
        <div>
            <x-group title="一卡通车场：">
                <x-xtextarea :height="250" v-model="cars" name="一卡通停车场" disabled></x-xtextarea>
            </x-group>
        </div>
    </div>
</template>

<script>
    import MyTable from '@/components/MyTable';
    export default {
        name: 'one-card-pass',
        beforeRouteUpdate(to, from, next) {
            // react to route changes...
            console.log('beforeRouteUpdate => ', to, from);
            next();
        },
        components: {
            MyTable,
        },
        data () {
            return {
                cars: '江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，江南时代大厦，莲馨家园北区，',
                lists: [
                    { name: '车牌号：', dec: '粤B12345'},
                    { name: '月卡停车场：', dec: '七星商业广场'},
                    { name: '月卡有效期：', dec: '2019-05-01 ～ 2019-05-31'},
                    { name: '一卡通区域：', dec: '深圳员工卡'},
                ]
            }
        },
        methods: {
        },
    };
</script>
<style lang="less">
@import "./index.less";
</style>
