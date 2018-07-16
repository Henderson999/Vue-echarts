<template>
  <div>
  	<div class="header" >
    <p>Echarts</p>
    </div>
    <div class="box"><search-show v-on:refresh="changeChat"class="search-show"></search-show></div>
    <div id="myChart" class="myChart"> </div>
    <my-dialoggreen :is-show="isShowLogDialog" @on-close="closeDialog('isShowLogDialog')">
      <p>这是Log</p>
    </my-dialoggreen>
    <my-dialogblue :is-show="isShowInfoDialog" @on-close="closeDialog('isShowInfoDialog')">
      <p>这是Info</p>
    </my-dialogblue>
    <my-dialogred :is-show="isShowWarnDialog" @on-close="closeDialog('isShowWarnDialog')">
      <p>这是Warn</p>
    </my-dialogred>
    <my-dialoggray :is-show="isShowErrorDialog" @on-close="closeDialog('isShowErrorDialog')">
      <p>这是Error</p>
    </my-dialoggray>
    <div class="tips">
      <button @click="LogClick()" class="button1">log</button>
      <button @click="InfoClick()" class="button2">info</button>
      <button @click="WarnClick()" class="button3">warn</button>
      <button @click="ErrorClick()" class="button4">error</button>
    </div>  
  </div>
</template>

<script>
//消息提示框
import DialogGreen from './dialoggreen'
import DialogBlue from './dialogblue'
import DialogRed from './dialogred'
import DialogGray from './dialoggray'
// 引入基本模板
let echarts = require('echarts/lib/echarts');
// 引入柱状图组件
require('echarts/lib/chart/bar');
// 引入提示框和title组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/markLine');
import searchShow from '../components/search'
export default {
  components:{
          searchShow,
          MyDialoggreen: DialogGreen,
          MyDialogblue: DialogBlue,
          MyDialogred: DialogRed,
          MyDialoggray: DialogGray,
  },
  data () {
    return {
      isShowLogDialog:false,
      isShowInfoDialog:false,
      isShowWarnDialog:false,
      isShowErrorDialog:false,
      test:'',
      gains:{},
      name:["daikon","spinach","peas","sprouts","carrot","cucumber","kennel","ginger","cowpeas","rutabaga","chives","fiddlehead","chilly","waternuts","asparagus","pumpkin","eggplant","yam","lettuce","beet","broccoli","cabbage"],
      keKong:[],
      buKeKong:{},
          }
  },
  //数据请求
   mounted() {
    this.drawLine();
   },
  methods: {
    LogClick () {
      this.isShowLogDialog = true 
    },
    InfoClick () {
      this.isShowInfoDialog = true 
    },
    WarnClick () {
      this.isShowWarnDialog = true 
    },
    ErrorClick () {
      this.isShowErrorDialog = true 
    },
    closeDialog (attr) {
      this[attr]= false
    },
    changeChat(item){
      
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      console.log(item)
      var newData = []
      newData.splice(0,1,item)
      
      var name =[]
      var keKong=[]
      var buKeKong=[]
      var id=[]
      this.axios.get('api/charts')
       .then((res) => {
        console.log('请求成功')
         var gains =res.data      
         for (var i = 0; i < gains.length; i++) {
          name.push(gains[i].name)
          id.push(gains[i].id)
          if(gains[i].ignored=='DISABLE')
          {
              keKong.push(gains[i].gains)
              buKeKong.push(0)
          }
          else{
            buKeKong.push(gains[i].gains)
            keKong.push(0)
          }
         }
          console.log(newData)
          var keKong1=[]
          var buKeKong1=[]
          var number= 0
          for (var i = 0; i < name.length; i++) {
              if(name[i]==newData[0]){
                  number= i
              }           
         }
         if (gains[number].ignored=='DISABLE') {
              keKong1.push(gains[number].gains)
         }
         else{
              buKeKong1.push(gains[number].gains)
         }
          console.log(number)
          myChart.setOption(
   {
  legend: {
        data: ['可控', '不可控']
         },
        dataZoom:{
           left: "92%",
           show: true,
           yAxisIndex: 0,
        },
   tooltip: {
        trigger: 'axis',
       },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    triggerEvent: "true",
    data:newData,
  },
  series: [
    {
      name: '可控',
      type: 'bar',
      stack: '总量',
     // data: [302],
     data: keKong1,
      color: '#174775'
    },
    {
      name: '不可控',
      type: 'bar',
      stack: '总量',
    // data: [120],
      data:buKeKong1,
      color: '#c2c2c2'
    },
    {
      type: "line",
      name: "当前选择",
      markLine: {
        silent: true,
        data: [
          {
            yAxis: newData
          }
        ]
      }
  }
    ]
});
      },(err) => {
        console.log(err,'请求失败')
       })   
    },

    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      let index=0
      // 指示线改变
      myChart.on('legendselectchanged',function (params){
       console.log(params);
       if (params.name=='可控') {
      this.setOption({
    series: [
      {
      type: "line",
      name: "当前选择",
      markLine: {
        silent: true,
        data: [
              {
               yAxis: name[0]
              }
             ]
        }
       }
     ]
    });}
      else{
     this.setOption({
    series: [
      {
      type: "line",
      name: "当前选择",
      markLine: {
        silent: true,
        data: [
              {
               yAxis: name[1]
              }
             ]
        }
       }
     ]
    });
 }   
      });

     //改变指示线位置
      myChart.on('click', function changeLine(params) {

      	if(params.seriesIndex==1||params.seriesIndex==0) {
        console.log(params);
        console.log(params.dataIndex);  
        index=params.dataIndex;  
        console.log(name[index]);
        console.log(id[index]);
        this.setOption({
        series: [
         {
             type: "line",
             name: "当前选择",
             markLine: {
             silent: true,
             data: [
              {
               yAxis: name[index]
              }
             ]
            }
           }
          ]
        });
       }
   });

     //改变数据可控性
      var data1 = [0, 0.17, 0.22, 0, 0, 0.38, 0.39, 0.4, 0, 0.45, 0.48, 0, 0.55, 0, 0.66, 0, 0, 0.81, 0.82, 0.91, 0, 1];
      var data2 =[0.15, 0, 0, 0.26, 0.37, 0, 0, 0, 0.41, 0, 0, 0.53, 0, 0.59, 0, 0.69, 0.73, 0, 0, 0, 0.97, 0];
     //var data1 = keKong;
     //var data2 = buKeKong;
      var show =true;
      myChart.on('click', function changedata(params) {
       if (params.yAxisIndex==0) {
       	 console.log(params);
         console.log(data1); 
       	 switch (params.value)
{
case name[1]:
  console.log(name[1]);
  if (show) {
  	data1.splice(1,1,false);
    data2.splice(1,1,keKong[1]);
  	show = false;
  	console.log(show)
  }
  else{
  	data1.splice(1,1,keKong[1]);
    data2.splice(1,1,false);
  	 show = true;
  	console.log(show)
  }
  break;
  case name[2]:
  console.log(name[2]);
  if (show) {
    data1.splice(2,1,false);
    data2.splice(2,1,keKong[2]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(2,1,keKong[2]);
    data2.splice(2,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[5]:
  console.log(name[5]);
  if (show) {
    data1.splice(5,1,false);
    data2.splice(5,1,keKong[5]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(5,1,keKong[5]);
    data2.splice(5,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[6]:
  console.log(name[6]);
  if (show) {
    data1.splice(6,1,false);
    data2.splice(6,1,keKong[6]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(6,1,keKong[6]);
    data2.splice(6,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[7]:
  console.log(name[7]);
  if (show) {
    data1.splice(7,1,false);
    data2.splice(7,1,keKong[7]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(7,1,keKong[7]);
    data2.splice(7,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[9]:
  console.log(name[9]);
  if (show) {
    data1.splice(9,1,false);
    data2.splice(9,1,keKong[9]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(9,1,keKong[9]);
    data2.splice(9,1,false);
     show = true;
    console.log(show)
  }
  break;case name[10]:
  console.log(name[10]);
  if (show) {
    data1.splice(10,1,false);
    data2.splice(10,1,keKong[10]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(10,1,keKong[10]);
    data2.splice(10,1,false);
     show = true;
    console.log(show)
  }
  break;case name[12]:
  console.log(name[12]);
  if (show) {
    data1.splice(12,1,false);
    data2.splice(12,1,keKong[12]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(12,1,keKong[12]);
    data2.splice(12,1,false);
     show = true;
    console.log(show)
  }
  break;case name[14]:
  console.log(name[14]);
  if (show) {
    data1.splice(14,1,false);
    data2.splice(14,1,keKong[14]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(14,1,keKong[14]);
    data2.splice(14,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[17]:
  console.log(name[17]);
  if (show) {
    data1.splice(17,1,false);
    data2.splice(17,1,keKong[17]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(17,1,keKong[17]);
    data2.splice(17,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[18]:
  console.log(name[18]);
  if (show) {
    data1.splice(18,1,false);
    data2.splice(18,1,keKong[18]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(18,1,keKong[18]);
    data2.splice(18,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[19]:
  console.log(name[19]);
  if (show) {
    data1.splice(19,1,false);
    data2.splice(19,1,keKong[19]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(19,1,keKong[19]);
    data2.splice(19,1,false);
     show = true;
    console.log(show)
  }
  break;
  case name[21]:
  console.log(name[21]);
  if (show) {
    data1.splice(21,1,false);
    data2.splice(21,1,keKong[21]);
    show = false;
    console.log(show)
  }
  else{
    data1.splice(21,1,keKong[21]);
    data2.splice(21,1,false);
     show = true;
    console.log(show)
  }
  break;

}
       	 this.setOption({
       	 	series: [
                {
      name: '可控',
      type: 'bar',
      stack: '总量',
      data: data1,
      color: '#174775'
    },
    {
      name: '不可控',
      type: 'bar',
      stack: '总量',
    // data: [120, 0, 0, 134, 0, 230],
      data:data2,
      color: '#c2c2c2'
    }
                ]
       	 	})
       }  
  });


  //显示图表

      var name =[]
      var keKong=[]
      var buKeKong=[]
      var id=[]
      this.axios.get('api/charts')
       .then((res) => {
        console.log('请求成功')
         var gains =res.data
         console.log(gains)       
         for (var i = 0; i < gains.length; i++) {
          name.push(gains[i].name)
          id.push(gains[i].id)
          if(gains[i].ignored=='DISABLE')
          {
              keKong.push(gains[i].gains)
              buKeKong.push(0)
          }
          else{
            buKeKong.push(gains[i].gains)
            keKong.push(0)
          }
         }
          console.log(name)
          console.log(id)
          console.log(keKong)
          console.log(buKeKong)
myChart.setOption(
   {
  legend: {
        data: ['可控', '不可控']
         },
        dataZoom:{
           left: "92%",
           show: true,
           yAxisIndex: 0,
        },
   tooltip: {
        trigger: 'axis',
       },
  xAxis: {
    type: 'value'
  },
  yAxis: {
    type: 'category',
    triggerEvent: "true",
    data:name
  },
  series: [
    {
      name: '可控',
      type: 'bar',
      stack: '总量',
     data: keKong,
      color: '#174775'
    },
    {
      name: '不可控',
      type: 'bar',
      stack: '总量',
      data:buKeKong,
      color: '#c2c2c2'
    },
    {
      type: "line",
      name: "当前选择",
      markLine: {
        silent: true,
        data: [
          {
            yAxis: name[index]
          }
        ]
      }
  }
    ]
});


      },(err) => {
        console.log(err,'请求失败')
       })

  
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
*{margin:0; padding:0;border: 0;font-size: 100%;font:inherit;vertical-align: baseline;}
article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{
	display: block;
}
a{color:#333; text-decoration: none;}
ol,ul,li{ list-style-type:none;}
blockquote,q{
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after{
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
body {
	background: #f0f2f5;
	font-family: "Helvetica Neue" , Helvetica, Arial, "Hiragino Sans GB" , "Hiragino Sans GB W3","Microsoft YaHei UI","Microsoft YaHei", "WenQuanYi Micro Hei",sans-serif;
	font-size: 14px;
	color: #444;
  line-height: 1;
}
.header{
         background: #363636;
         color: #b2b2b2;
         height: 90px;
         line-height: 90px;
         width: 100%;
}
.header p {
	text-align: center;
	font-size: 20px;
}
.myChart {
	width: 800px;
	height: 800px;
	margin: 0 auto;
}
.box {
  margin: 0 auto;
  width: 200px;
  height: 10px;
  
}
.search-show{
  position: relative;
  top: 30px;
  left: 200px;
  z-index: 99;
}
.tips {
  margin: 0 auto;
  width: 500px;
  margin-top: 100px;
  margin-bottom: 100px;
}
.tips button {
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}
.button1 {background-color: #4CAF50;} /* Green */
.button2 {background-color: #008CBA;} /* Blue */
.button3 {background-color: #f44336;} /* Red */ 
.button4 {background-color: #e7e7e7; color: black;} /* Gray */
</style>
