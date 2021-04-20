<template>
    <x-popup :value="isShow" @on-hide="cancel">
        <x-popupheader left-text="取消"
                       right-text="确认"
                       title="请选择"
                       :show-bottom-border="false"
                       @on-click-left="cancel"
                       @on-click-right="ok">
        </x-popupheader>
        <x-picker :data='pickerData'
                  v-model='selectValue'
                  @on-change='change'></x-picker>
    </x-popup>
</template>
<script>
export default {
    name: "my-picker",
    props: {
        isShow: {
            required: true,
            type: Boolean,
            default() {
                return false;
            }
        },
        data: {
            required: true,
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            selectValue: [],
            pickerData: []
        };
    },
    watch: {
        data(val) {
            this.pickerData = [val];
        },
        isShow(val) {
            this.showMe = val;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.pickerData = [this.data];
        });
    },
    methods: {
        change(value) {},
        ok() {
            let tempData = this.pickerData[0];
            let result = tempData.filter(
                item => item.value == this.selectValue
            );
            this.$emit("change", result[0]);
        },
        cancel() {
            this.$emit("handleClose");
        }
    }
};
</script>
