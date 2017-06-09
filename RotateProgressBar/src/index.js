import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ART,
  PanResponder,UIManager
} from 'react-native';
var {
  Surface,
  Group,
  Shape,
  Path
} = ART;
export default class ProgressChooser extends Component{
    constructor(props)
    {
        super(props);
        let res=this.getLocationByArc(this.props.defaultAngle,this.props.Angle);
        let bgx=res.begin.x;let bgy=res.begin.y;
        this.state={
            path:res.path,
            beginLocation:new Animated.ValueXY({x:bgx,y:bgy}),
            endLocation:res.end,
            beginAngle:this.props.defaultAngle,
            Angle:this.props.Angle
        }
        this.beginThumbResponder=PanResponder.create({
             onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
      },
      onPanResponderMove: (evt, gestureState) => {
      let beginAngle=this.getArcByLocation(evt.nativeEvent.pageX-this.leftx,evt.nativeEvent.pageY-this.topy);

      this.state.Angle=this.state.Angle-beginAngle+this.state.beginAngle;
      this.state.beginAngle=beginAngle;

      let res=this.getLocationByArc(this.state.beginAngle,this.state.Angle);
      this.setState({path:res.path});
      Animated.timing(this.state.beginLocation,{toValue:{x:res.begin.x,y:res.begin.y},duration:0}).start(); 
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (evt, gestureState) => {

      },

        });

    }
    render(){
        return(<View style={[{height:200,width:200,backgroundColor:'#eeeeee'},this.props.style]}
        onLayout={(e)=>{ UIManager.measure(e.target,(x,y,width,height,pageX,pageY)=>{this.topy=pageY;this.leftx=pageX})}}>
            <Surface height={this.props.style.height} width={this.props.style.height}>
                <Shape d={this.state.path} stroke='red'  strokeWidth={this.props.strokeWidth}
               />
                </Surface>
            <Animated.View 
            {... this.beginThumbResponder.panHandlers}
            style={{height:this.props.SliderStyle.height,width:this.props.SliderStyle.width
            ,position:'absolute',top:-.5*this.props.SliderStyle.height,left:-.5*this.props.SliderStyle.width,
            transform:[{translateX:this.state.beginLocation.x},{translateY:this.state.beginLocation.y}]}}>
            <View style={{height:this.props.SliderStyle.height,width:this.props.SliderStyle.width,borderRadius:this.props.SliderStyle.height*0.5,backgroundColor:this.props.SliderStyle.backgroundColor}}/>
                </Animated.View>
                
       </View>)
    }

//begin 开始角度， arc 弧度  均为逆时针
    getLocationByArc(beginAngle,Angle){

        let radius=this.props.style.height*0.5-this.props.strokeWidth*0.5;
        let dgr=Math.PI*Angle;
        let defaultdgr=Math.PI*beginAngle;
        let dflocationx=radius*(1+Math.cos(-1*defaultdgr))+this.props.strokeWidth*0.5
         let dflocationy=radius*(1-Math.sin(-1*defaultdgr))+this.props.strokeWidth*0.5
        let locationX=radius*(1+Math.cos(-1*defaultdgr-dgr))+this.props.strokeWidth*0.5
        let locationY=radius*(1-Math.sin(-1*defaultdgr-dgr))+this.props.strokeWidth*0.5
        let path = Path().moveTo(dflocationx, dflocationy)
      .arcTo(locationX, locationY,radius,radius,dgr>Math.PI?1:0);
    return {path:path,begin:{x:dflocationx,y:dflocationy},end:{x:locationX,y:locationY}
}

    }

getArcByLocation(x,y)
{let tX=x-this.props.style.width*0.5;let tY=y-this.props.style.height*0.5;

    let res=Math.atan(tY/tX)/Math.PI;if(tX<0 && tY<0)res-=1;if(tX<0 && tY>0)res+=1;
    console.log(res)
    return res
}
}
ProgressChooser.defaultProps={
    style:{height:200,width:200},
    strokeWidth:10,
    defaultAngle:0.25,
    Angle:0.5,
    SliderStyle:{
        height:30,width:30,backgroundColor:'blue'
    }
}