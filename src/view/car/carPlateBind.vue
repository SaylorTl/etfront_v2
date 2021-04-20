<template>
    <div class="page-plate-bind">
        <div class="page-plate-bind-label">
            <div>请输入车牌：</div>
            <div @click="changeSpecial">特</div>
        </div>
        <div class="page-plate-bind-picker">
            <plate-picker :initPlate="plate" :isSpecial="isSpecial" @ok="getPlate"></plate-picker>
        </div>
        <div class="page-plate-bind-btn">
            <x-xbutton :disabled="noPay" @click.native="nextStep">下一步</x-xbutton>
        </div>
    </div>
</template>
<script>
import utils from "utils/utils.js";
import PlatePicker from "../../components/PlatePicker/index";
export default {
    name: "car-plate-bind",
    props: {},
    components: {
        PlatePicker
    },
    data() {
        return {
            isSpecial: false,
            plate: "",
            bindType: "",
            noPay: true
        };
    },
    mounted() {
        const { plate, bindType } = this.$route.query;
        this.plate = plate || "";
        this.bindType = bindType || "";
        if (this.bindType === "temp") {
            utils.setTitle("车辆认证");
        } else if (this.bindType === "month") {
            utils.setTitle("月卡申请");
        }
    },
    methods: {
        changeSpecial() {
            this.isSpecial = !this.isSpecial;
        },
        getPlate(data) {
            this.plate = data.plate;
            if (!data.isError) {
                this.noPay = false;
            }
        },
        nextStep() {
            if (this.bindType === "month") {
                this.$router.push({
                    path: "/ui/ui-stations",
                    query: {
                        urlName: "car-card-upload",
                        plate: this.plate,
                        bindType: this.bindType
                    }
                });
            } else if (this.bindType === "temp") {
                this.$router.push({
                    path: "/car/car-card-upload",
                    query: {
                        plate: this.plate,
                        bindType: this.bindType
                    }
                });
            }
        }
    }
};
</script>

