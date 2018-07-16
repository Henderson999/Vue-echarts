<template>
    <div >
        <!-- 组件不能写到template的根节点上，即每个组件只有一个根节点，这里的div就是这个template的根节点 -->
        <div class="search-input" >
            <!-- 这是一个小叉叉，点击它可清除输入框内容 -->
            <input type="text" v-model="key" @keyup="get()" @keyup.delete="del()" v-bind:class="{show:isShowInput}">
            <span class="search-reset" v-bind:class="{show:isShowInput}"></span>
            
            <div class="search-select">
                    <ul v-bind:class="{show:isShow}">
                    <li v-bind:class="{gray:index==indexPrev}" @click="chooseDate(item,index)" v-for="(item,index) in filterMyData" @mouseover="over(index)" >
                        {{item}}
                    </li>
                    </ul>
            </div>
        </div>
        <button class="search-btn" @click="clickB()"  ></button>
    </div>
</template>

<script type="text/javascript">
export default {
    //注册组件
    components: {
        
    },
    data: function() {
        return {
            myData: [],
            myData2:["daikon","spinach","peas","sprouts","carrot","cucumber","kennel","ginger","cowpeas","rutabaga","chives","fiddlehead","chilly","waternuts","asparagus","pumpkin","eggplant","yam","lettuce","beet","broccoli","cabbage"],
            key: '',//v-model绑定的输入框的value
            now: -1,
            searchIndex: 0,
            indexPrev:0,
            isShow:true,
            isShowInput:true,
        }
    },
    computed:{

        filterMyData : function() {

            var key = this.key;
            var myData2 = this.myData2;
            return myData2.filter(function(item
                ){
                return item[0].toLowerCase().indexOf(key.toLowerCase())  != -1
                }) 
    }
},
    methods: {
        chooseDate:function(item,index) {
            console.log(item);
            this.$emit('refresh',item)
        },
        over(index){
            this.indexPrev=index
        },
        get() {
           this.isShow=false
        },
        clickB() {
           this.isShowInput=!this.isShowInput
        },
        del(){
            var key = this.key
            if(key==''){
                this.isShow=true
            }
        },
    }
}
</script>

<style type="text/css">
ol,ul,li{ list-style-type:none;}
.search-input {
    height: 30px;
    width: 250px;
    margin: 0 auto;
    margin-top: 10px;
    position: relative;
}

.search-input input {
    border: 1px solid #e4e4e4;
    box-sizing: border-box;
    width: 200px;
    height: 30px;
    font-size: 18px;
    float: left;
    padding-left: 10px;
    padding-right: 10px;
    overflow: hidden;
    box-shadow: 0px 2px 2px #888888;

}

.search-btn {
    position: relative;
    top: -28px;
    left: 200px;
    height: 25px;
    width: 25px;
    background: url("../../src/assets/search.png") no-repeat;
    color: white;
    float: left;
}

.search-btn {
    cursor: pointer
}

.search-select {
    position: absolute;
    top: 30px;
    left: 0px;
    width: 200px;
    box-sizing: border-box;
    margin-top: 4px;
    z-index: 999;
    box-shadow: 0px 2px 2px #888888;
    background: #fff;

}

.search-select li {
    border: 1px solid #d4d4d4;
    text-align: center;
    border-top: none;
    border-bottom: none;
    width: 100%;
    display: block;
    box-sizing: border-box;
    padding: 7px 10px;
    cursor: pointer;
}
.gray {
	background-color: #D8D8D8;
}
.show {
    display: none;
}
.search-select li:hover {
    
}
.selectback {
    background-color: #eee !important;
    cursor: pointer
}
input::-ms-clear {
    display: none
}
.search-reset {
    width: 26px;
    height: 26px;
    position: absolute;
    line-height: 21px;
    text-align: center;
    cursor: pointer;
    font-size: 20px;
    right: 50px;
    top: 4px;
    background: url("../../src/assets/renovate.png");
}
.search-select-list {
    transition: all 0.5s
}
.search-select ul{margin:0;text-align: left; }
</style>
