import Vue from 'vue'
//引入TransferDom指令，防止z-index 失效
import { TransferDom } from 'vux'
Vue.directive('transfer-dom', TransferDom)

//引入插件
import { AlertPlugin, ConfirmPlugin, ToastPlugin, ConfigPlugin } from 'vux'
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfigPlugin)

//引入组件

import { VChart, VLine, VArea, VBar, VPie, VPoint, VScale, VAxis, VGuide, VTooltip, VLegend, Timeline, XCircle, Actionsheet, Alert, Confirm, InlineLoading, LoadMore, Msg, Popover, PopupHeader, Popup, Spinner, Toast, XDialog, ButtonTab, ButtonTabItem, Drawer, Tab, TabItem, Tabbar, TabbarItem, XHeader, Badge, Card, Cell, Group, Countup, Flow, FlowState, FlowLine, Marquee, MarqueeItem, Panel, Previewer, Qrcode, Step, StepItem, Swiper, XProgress, XTable, Calendar, CellBox, CellFormPreview, CheckIcon, Checker, CheckerItem, Checklist, DatetimeRange, DatetimeView, Datetime, FormPreview, InlineXNumber, InlineCalendar, Picker, PopupPicker, PopupRadio, Radio, Range, Rater, Search, Selector, Swipeout, SwipeoutItem, SwipeoutButton, XAddress, XInput, XNumber, XSwitch, XTextarea, Divider, Flexbox, FlexboxItem, Grid, GridItem, Sticky, ViewBox, Icon, XButton, Countdown, Masker, Scroller, WechatEmotion } from 'vux'
let components = { VChart, VLine, VArea, VBar, VPie, VPoint, VScale, VAxis, VGuide, VTooltip, VLegend, Timeline, XCircle, Actionsheet, Alert, Confirm, InlineLoading, LoadMore, Msg, Popover, PopupHeader, Popup, Spinner, Toast, XDialog, ButtonTab, ButtonTabItem, Drawer, Tab, TabItem, Tabbar, TabbarItem, XHeader, Badge, Card, Cell, Group, Countup, Flow, FlowState, FlowLine, Marquee, MarqueeItem, Panel, Previewer, Qrcode, Step, StepItem, Swiper, XProgress, XTable, Calendar, CellBox, CellFormPreview, CheckIcon, Checker, CheckerItem, Checklist, DatetimeRange, DatetimeView, Datetime, FormPreview, InlineXNumber, InlineCalendar, Picker, PopupPicker, PopupRadio, Radio, Range, Rater, Search, Selector, Swipeout, SwipeoutItem, SwipeoutButton, XAddress, XInput, XNumber, XSwitch, XTextarea, Divider, Flexbox, FlexboxItem, Grid, GridItem, Sticky, ViewBox, Icon, XButton, Countdown, Masker, Scroller, WechatEmotion };
Object.keys(components).forEach(item => {
    Vue.component('x-' + item.toLowerCase(), components[item]);
})