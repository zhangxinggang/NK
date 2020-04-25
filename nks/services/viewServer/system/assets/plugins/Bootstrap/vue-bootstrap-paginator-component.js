Vue.component('bootstrap_paginator',{
    model:{
        prop:'pageIndex',
        event:'change'
    },
    props:{
        "total":{required:true,type:Number},                    //总记录数
        "pageSize":Number,                                      //页大小
        "barSize":{type:Number,default:10},                     //页码器上，一次显示几页
        "pageIndex":{required:true,type:Number},                //当前页 (v-model)
        "pageSizeList":{type:Array,default:[10,20,30,40,50]},   //每页显示多少条的数组
        "showListBar":{type:Boolean,default:false},             //显示“每页 X 条”栏
        "showIndexBar":{type:Boolean,default:true},             //显示“第几页/共几页”栏
    },
    data:function(){
        return {
            pindex: 1,
            psize: 10,
        }
    },
    computed: {
        //总页数 （计算值）
        pcount: function () {
            return parseInt((this.total - 1) / this.psize) + 1;
        },
        //页码集
        indexes: function () {
            //参数修正
            this.pindex = this.pageIndex || 1;
            if (isNaN(this.pindex)) this.pindex = 1;
            if (this.pindex < 1) this.pindex = 1;
            if (this.pindex > this.pcount) this.pindex = this.pcount;
            //求indexes
            var left = 1;
            var right = this.pcount;
            var bcenter = parseInt(this.barSize / 2);
            var ar = [];
            if (this.pcount > this.barSize) {
                if (this.pindex > bcenter && this.pindex <= this.pcount - bcenter) {
                    left = this.pindex - bcenter
                    right = this.pindex + (bcenter - 1) + (this.barSize % 2); //奇数多显示一页
                } else {
                    if (this.pindex <= bcenter) {
                        left = 1
                        right = this.barSize;
                    } else {
                        right = this.pcount;
                        left = this.pcount - (this.barSize - 1);
                    }
                }
            }
            while (left <= right) {
                ar.push(left)
                left++
            }
            return ar;
        },
        showLast: function () {
            return this.pindex != this.pcount
        },
        showFirst: function () {
            return this.pindex != 1
        }
    },
    watch: {
        //监视如果 pindex 发生变化，就触发 change 事件
        pindex: function () {
            this.$emit('change',this.pindex);
        },
    },
    methods: {
        //跳转页码
        go: function (i) {
            if (i < 1 || i > this.pcount) return;
            this.pindex = i;
        }
    },
    template:'<ul class="pagination">\
        <li :class="{disabled:!showFirst}">\
            <a href="javascript:void(0)" @click="go(1)">第一页</a>\
        </li>\
        <li :class="{disabled:!showFirst}">\
            <a href="javascript:void(0)" @click="go(pindex-1)">上一页</a>\
        </li>\
        <li v-for="i in indexes" :class="{active:i==pindex}">\
            <a href="javascript:void(0)" @click="go(i)">{{ i }}</a>\
        </li>\
        <li :class="{disabled:!showLast}">\
            <a href="javascript:void(0)" @click="go(pindex+1)">下一页</a>\
        </li>\
        <li :class="{disabled:!showLast}">\
            <a href="javascript:void(0)" @click="go(pcount)">第末页</a>\
        </li>\
        <li v-if="showListBar" class="form-inline">\
            <span>每页 \
            <select class="form-control" v-model.number="psize" style="padding:0 0px;height:18px;width:48px;text-align:center;margin-top:-4px;" >\
                <option v-for="ps in pageSizeList">{{ ps }}</option>\
            </select> 条</span>\
        </li>\
        <li v-if="showIndexBar" class="form-inline">\
            <span>第 <input v-model.number="pindex" type="text" class="form-control" style="padding:0;height:18px;width:42px;text-align:center;margin-top:-4px;" /> 页 / 共{{pcount}}页</span>\
        </li>\
    </ul>',
    created:function(){
        this.psize=this.pageSize || this.psize;
        //一进来就触发 change 事件
        this.$emit('change',this.pageIndex);
    }
});