<template>
    <transition name="slide">
        <div v-if="isShow" class="ui-letter-selector">
            <div class="content">
                <div class="inner">
                    <div>
                        <template v-for="(item, index) in letterList">
                            <dl :key="index" :value="index">
                                <dt>{{index}}</dt>
                                <dd 
                                    v-for="(_item, index) in item"
                                    class="bdb" 
                                    @click="_chooseOne(_item)" 
                                    :key="index"
                                >
                                    <img v-if="showIcon" :src="_item.icon">
                                    <span>{{_item.cityName}}</span>
                                </dd>
                            </dl>
                        </template>
                    </div>
                    <div class="letter-nav" v-if="isShow" @touchmove="_touchLetters">
                        <ol>
                            <li>
                                <em data-type="init" @click="_chooseLetter">#</em>
                            </li>
                            <li
                                v-for="(item, index) in letterList" 
                                :key="index"
                                @click="_chooseLetter" 
                                data-type="letter"
                            >
                                {{index}}
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
	</transition>
</template>

<script>
    const scrollTopAnimate = (current, target, element, speed=50) => {
        const targetTop = target;
        let currentTop = current;
        let requestId;
        let step;
        if(currentTop <= target) {
            step = function() {
                currentTop += speed;
                if(currentTop <= targetTop) {
                    element.scrollTop = currentTop;
                    requestId = window.requestAnimationFrame(step);
                } else {  
                    window.cancelAnimationFrame(requestId);
                }
            }
        } else {
            step = function() {
                if(currentTop >= targetTop) {
                    currentTop -= speed;
                    element.scrollTop = currentTop;
                    requestId = window.requestAnimationFrame(step);
                } else {  
                    window.cancelAnimationFrame(requestId);
                }
            }
        }
        window.requestAnimationFrame(step);
    };
    export default {
        props: {
            isShow: {
                type: Boolean,
                default: false,
                required: false
            },
            showIcon: {
                type: Boolean,
                default: false,
                required: false
            },
            localCity: {
                type: Object
            },
            data: {
                type: Array
            },
            onChoose: {     
                type: Function
            },
            /**
             * call back when click cancel button
             */
            close: {
                type: Function
            }
        },
        data: function() {
            return {
                list: '',
                targetLetter: '',
                hotList: [],
                letterList: [],
                result: '',
                defaultTrigger: true
            }
        },
        watch: {
            data: function() {
                if (this.data && this.data.length > 0) {
                    this._formatData(this.data);
                }
            },
            targetLetter: function() {
                this._scrollView();
            }
        },
        activate: function(done) {
            const _this = this;
            done();
            if (this.data && this.data.length > 0) {
                this._formatData(this.data);
            }
        },
        methods: {
            show: function() {
                // this.isShow = true;
            },
            hide: function() {
                // this.isShow = false;
                this.searchList = [];
                this.close && this.close()
            },
            /**
             * 点击字母
             */
            _chooseLetter: function(e) {
                let symbol = e.target.getAttribute('data-type')
                if (symbol === 'init') {
                    this.targetLetter = '#';
                } else {
                    this.targetLetter = e.target.innerText;
                }
            },
            /**
             * slide letters list
             */
            _touchLetters: function(e) {
                e.preventDefault();
                let ol = document.querySelector('.ui-letter-selector .letter-nav ol'),
                    liNum = document.querySelectorAll('.ui-letter-selector .letter-nav li').length,
                    olHei = ol.clientHeight, //ol height
                    liHei = Math.round(olHei / liNum), //li height
                    olTop = ol.offsetTop + ol.offsetParent.offsetTop,
                    olBot = olTop + olHei,
                    touchY = e.touches[0].pageY,
                    $wrapper = document.querySelector('.ui-letter-selector')
                switch (e.type) {
                    case 'touchstart':
                        if (touchY < olTop) {
                            // 回顶
                            $wrapper.scrollTop = 0;
                        } else if (touchY > olBot) {
                            // 到底
                            $wrapper.scrollTop = 10000;
                        }
                        break;
                    case 'touchmove':
                        if (touchY < olBot && touchY > olTop) {
                            let olTouchY = touchY - olTop,
                                targetIndex = Math.ceil(olTouchY / liHei),
                                target = document.querySelectorAll('.ui-letter-selector .letter-nav li')[targetIndex - 1]
                            if (target.getAttribute('data-type') == 'init') {
                                this.targetLetter = '#';
                            } else {
                                this.targetLetter = target.innerText;
                            }
                        } else if (touchY <= olTop) {
                            // 回顶
                            $wrapper.scrollTop = 0;
                        } else {
                            // 到底
                            $wrapper.scrollTop = 10000;
                        }
                        break;
                }
            },
            /**
             * 滚动可视区 - Triggered by '_chooseLetter'
             */
            _scrollView: function() {
                const _this = this;
                const dtList = document.querySelectorAll('.ui-letter-selector .inner dl');
                const _dtList = Array.from(dtList)
                if (_dtList) {
                    _dtList.forEach((value, index, array) => {
                        const currentLetter = value.getAttribute('value');
                        const wrapper = document.querySelector('.ui-letter-selector');
                        if (_this.targetLetter === '#') {
                            scrollTopAnimate(wrapper.scrollTop, 0, wrapper)
                        } else if (currentLetter === _this.targetLetter) {
                            scrollTopAnimate(wrapper.scrollTop, value.offsetTop, wrapper)
                        }
                    })
                }
            },
            /**
             * format data
             * @param  {[Array]} arr [cityList]
             */
            _formatData: function(arr) {
                const letterArr = {}
                for (let i = 0; i < arr.length; i++) {
                    if (!(arr[i]['cityFirstLetter'] in letterArr)) {
                        letterArr[arr[i]['cityFirstLetter']] = [];
                        letterArr[arr[i]['cityFirstLetter']].push(arr[i]);
                    } else {
                        letterArr[arr[i]['cityFirstLetter']].push(arr[i]);
                    }
                }
                this.letterList = letterArr;
            },
            _chooseOne: function(obj) {
                this.onChoose && this.onChoose(JSON.parse(JSON.stringify(obj)));
            }
        }
    }
</script>

<style lang="less">
    @import './index.less';
</style>
