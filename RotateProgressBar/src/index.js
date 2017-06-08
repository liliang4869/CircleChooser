import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ART
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
        this.state={rotation:new Animated.Value(0),indicator1:new Animated.ValueXY(0,0),indicator2:new Animated.ValueXY(0,0),
            path:Path().moveTo(0,0).lineTo(0,0)
        }
    }
    render(){

        let radius=95;
        let dgr=Math.PI*.5;
        let defaultdgr=Math.PI*.2;
        let dflocationx=radius*(1+Math.cos(-1*defaultdgr))+5
         let dflocationy=radius*(1-Math.sin(-1*defaultdgr))+5
        let locationX=radius*(1+Math.cos(-1*defaultdgr-dgr))+5
        let locationY=radius*(1-Math.sin(-1*defaultdgr-dgr))+5
        console.log(dflocationx,dflocationy,locationX,locationY)
        let path = Path().moveTo(dflocationx, dflocationy)
      .arcTo(locationX, locationY,radius,radius,dgr>Math.PI?1:0)

        return(<View style={{height:200,width:200,backgroundColor:'#eeeeee',justifyContent:'center',alignItems:'center'}}>
            <Surface height={200} width={200}>
                <Shape d={path} stroke='red'  strokeWidth={10}/>
                </Surface>
                
       </View>)
    }
}