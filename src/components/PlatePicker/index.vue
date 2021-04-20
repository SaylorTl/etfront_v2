<template>
    <div>
        <div class="ui-plate-picker" v-if="!isSpecial">
            
            <div class="ui-plate-item first" :class="{'active':0 === currIndex}" @click="showBox(0)">{{plateArr[0]}}</div>
            <div class="ui-plate-middle">
                <div v-for="(item,index) in middleArr" :key="index" class="ui-plate-item" :class="{'active':(index+1) === currIndex}" @click="showBox(index+1)">{{item}}</div>
            </div>
            <div class="ui-plate-item last" :class="{'active':7 === currIndex}" @click="showBox(7)">{{plateArr[7] || '+'}}</div>
        </div>
        <div v-else class="ui-special-plate">
            <img  v-if="!!plate" @click="inputClear" src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images20190312/icon_off.svg">
            <x-xinput v-model="plate" placeholder="请输入车牌号" :show-clear="false" novalidate placeholder-align="left" :debounce="1000" @on-change="inputChange"></x-xinput>
        </div>
        <transition name="keyboard">
            <div class="ui-plate-keyboard" v-if="showKeyBoard">
                <div class="keyboard-top">
                    <div @click="closeBox">取消</div>
                    <div v-if="keyBoardShow">{{plateArr.join("")}}</div>
                    <div @click="ok">确认</div>
                </div>
                <div class="keyboard-char">
                    <div v-for="(item,index) in keyCodes" :key="index" @click="setCodes(item)">{{item}}</div>
                    <div class="keyboard-delete-btn" @click="removeChar">
                        <img src="https://cdn-1256130579.cos.ap-shanghai.myqcloud.com/images/20190709/backspace.svg">
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
// import uitls from '../../utils/utils'
export default {
    name: "plate-picker",
    props: {
        isSpecial: {
            type: Boolean,
            default() {
                return false;
            }
        },
        initPlate: {
            type: String,
            default: ""
        }
    },
    components: {},
    data() {
        return {
            plateArr: ["", "", "", "", "", "", "", ""],
            keyCodes: [],
            plate: "",
            showKeyBoard: false,
            currIndex: 0,
            keyBoardShow:false
        };
    },
    computed: {
        middleArr(){
            return this.plateArr.slice(1,7)
        },
    },
    watch: {
        initPlate(val) {
            if (!!val && !this.isSpecial) {    
                this.plateArr = ["", "", "", "", "", "", "", ""];
                let oArr = val.split("");
                oArr.map((item, index) => {
                    this.$set(this.plateArr, index, item);
                });
                // this.currIndex = oArr.length - 1;
            }else if(this.isSpecial && !val){
                this.plate = "";
                this.$emit("ok",{
                    plate:"",
                    isError:true
                })
            }else if(!this.isSpecial && !val){
                this.plateArr = ["", "", "", "", "", "", "", ""];
                this.currIndex = 0;
            }
        },
        isSpecial(val) {
            if (val) {
                this.showKeyBoard = false;
            }
        },
        plateArr(val) {
            let param = {};
            let tempArr = val;
            let tempStr = tempArr.join("");
            if (!!tempArr[7] && tempStr.length === 8) {
                param = {
                    isGreen: true,
                    isError: false,
                    plate: tempArr.join("")
                };
            } else if (!!tempArr[7] && tempStr.length < 8) {
                param = {
                    isGreen: true,
                    isError: true,
                    plate: tempArr.join("")
                };
            } else if (!!tempArr[6] && tempStr.length === 7) {
                param = {
                    isGreen: false,
                    isError: false,
                    plate: tempArr.join("")
                };
            } else {
                param = {
                    isGreen: false,
                    isError: true,
                    plate: tempArr.join("")
                };
            }
            this.$emit("ok", param);
        }
    },
    mounted() {
        if (!!this.initPlate && !this.isSpecial) {    
                this.plateArr = ["", "", "", "", "", "", "", ""];
                let oArr = this.initPlate.split("");
                oArr.map((item, index) => {
                    this.$set(this.plateArr, index, item);
                });
                this.currIndex = oArr.length - 1;
            }
    },
    destroyed() {},
    methods: {
        showBox(index) {
            let codes = [];
            this.showKeyBoard = true;
            this.keyBoardShow = true;
            if (index === 0) {
                codes = [
                    "京",
                    "沪",
                    "粤",
                    "津",
                    "冀",
                    "晋",
                    "蒙",
                    "辽",
                    "吉",
                    "黑",
                    "苏",
                    "浙",
                    "皖",
                    "闽",
                    "赣",
                    "鲁",
                    "鄂",
                    "豫",
                    "湘",
                    "桂",
                    "琼",
                    "渝",
                    "川",
                    "贵",
                    "云",
                    "藏",
                    "陕",
                    "甘",
                    "青",
                    "宁",
                    "新",
                    "使",
                    "E"
                ];
            } else if (index === 7 || (index > 0 && index < 6)) {
                codes = [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "0",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                    "G",
                    "H",
                    "J",
                    "K",
                    "L",
                    "M",
                    "N",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T",
                    "U",
                    "V",
                    "W",
                    "X",
                    "Y",
                    "Z"
                ];
            } else {
                codes = [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "0",
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                    "G",
                    "H",
                    "J",
                    "K",
                    "L",
                    "M",
                    "N",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T",
                    "U",
                    "V",
                    "W",
                    "X",
                    "Y",
                    "Z",
                    "挂",
                    "学",
                    "警",
                    "港",
                    "澳",
                    "领"
                ];
            }
            this.keyCodes = codes;
            this.currIndex = index;
        },
        closeBox() {
            this.showKeyBoard = false;
            this.keyBoardShow = false;
        },
        setCodes(item) {
            this.$set(this.plateArr, this.currIndex, item);
            this.currIndex++;
            if (this.currIndex > 7) {
                this.currIndex = 7;
            }
            this.showBox(this.currIndex);
        },
        ok() {
            let param = {};
            let tempArr = this.plateArr;
            let tempStr = tempArr.join("");
            if (!!tempArr[7] && tempStr.length === 8) {
                param = {
                    isGreen: true,
                    isError: false,
                    plate: tempArr.join("")
                };
            } else if (!!tempArr[7] && tempStr.length < 8) {
                param = {
                    isGreen: true,
                    isError: true,
                    plate: tempArr.join("")
                };
            } else if (!!tempArr[6] && tempStr.length === 7) {
                param = {
                    isGreen: false,
                    isError: false,
                    plate: tempArr.join("")
                };
            } else {
                param = {
                    isGreen: false,
                    isError: true,
                    plate: tempArr.join("")
                };
            }
            this.showKeyBoard = false;
            this.keyBoardShow = false;
            this.$emit("ok", param);
        },
        removeChar() {
            let index = this.currIndex;
            this.$set(this.plateArr, index, "");
            index--;
            if (index < 0) {
                index = 0;
                this.currIndex = index;
            } else {
                this.currIndex = index;
            }
            this.showBox(index);
        },
        clearPlate(){
           this.plateArr = ["", "", "", "", "", "", "", ""];
           this.currIndex = 0;
           this.showBox(0); 
        },
        inputChange(value) {
            if (!!value) {
                this.plate = value;
                let param = {};
                if (value.length < 9) {
                    param = {
                        isError: false,
                        plate: value
                    };
                } else {
                    param = {
                        isError: true,
                        plate: value
                    };
                }
                this.$emit("ok", param);
            }
        },
        inputClear() {
            this.plate = '';
            let param = {
                isError: true,
                plate: ""
            };
            this.$emit("ok", param);
        }
    }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
