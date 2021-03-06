import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    ART,
    PanResponder, UIManager,
    NetInfo
} from 'react-native';
var {
  Surface,
    Group,
    Shape,
    Path
} = ART;
export default class ProgressChooser extends Component {
    constructor(props) {
        super(props);
        let res = this.getLocationByArc(this.props.defaultAngle, this.props.Angle);
        let bgx = res.begin.x; let bgy = res.begin.y; endx = res.end.x; endy = res.end.y;
        this.state = {
            path: res.path,
            beginLocation: new Animated.ValueXY({ x: bgx, y: bgy }),
            endLocation: new Animated.ValueXY({ x: endx, y: endy }),
            beginAngle: this.props.defaultAngle,
            Angle: this.props.Angle
        }
        this.beginThumbResponder = this.createBeginThumbResponder();
        this.endThumbResponder = this.createEndThumbPanResponder();

    }
    createBeginThumbResponder() {
        return PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
            },
            onPanResponderMove: (evt, gestureState) => {
                let za = this.props.ZeroAngle % 2;
                let ma = this.props.MaxAngle % 2;
                if (za < 0) za += 2
                if (ma <= 0) ma += 2
                let beginAngle = this.getArcByLocation(evt.nativeEvent.pageX - this.leftx, evt.nativeEvent.pageY - this.topy);
                if (beginAngle < 0) return;
                let curAngle = this.state.Angle - beginAngle + this.state.beginAngle;
                if (curAngle < -0.1) return;
                else if (curAngle <= 0.05) {
                    this.state.beginAngle = this.state.Angle+this.state.beginAngle-0.05;
                    this.state.Angle = 0.05;
                } else if (curAngle > ma) {
                    this.state.beginAngle = 0;
                    this.state.Angle = ma;
                } else {
                    this.state.beginAngle = beginAngle;
                    this.state.Angle = curAngle <= 0.05 ? 0.05 : curAngle;
                }
                
                let res = this.getLocationByArc(this.state.beginAngle, this.state.Angle);
                this.setState({ path: res.path });
                Animated.timing(this.state.beginLocation, { toValue: { x: res.begin.x, y: res.begin.y }, duration: 0 }).start();
                Animated.timing(this.state.endLocation, { toValue: { x: res.end.x, y: res.end.y }, duration: 0 }).start();
            },
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderRelease: (evt, gestureState) => {
                console.log(this.state.beginAngle, this.state.Angle, '-----------')
            },

        });
    }
    createEndThumbPanResponder() {
        return PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
            },
            onPanResponderMove: (evt, gestureState) => {
                let endAngle = this.getArcByLocation(evt.nativeEvent.pageX - this.leftx, evt.nativeEvent.pageY - this.topy);
                let curAngle = endAngle - this.state.beginAngle
                if (curAngle < -0.1) return;
                this.state.Angle = curAngle <= 0.05 ? 0.05 : curAngle;
                let res = this.getLocationByArc(this.state.beginAngle, this.state.Angle);

                Animated.timing(this.state.endLocation, { toValue: { x: res.end.x, y: res.end.y }, duration: 0 }).start();
                this.setState({ path: res.path });

                Animated.timing(this.state.beginLocation, { toValue: { x: res.begin.x, y: res.begin.y }, duration: 0 }).start();

            },
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderRelease: (evt, gestureState) => {

            },

        });
    }
    render() {
        return (<View style={[{ height: 200, width: 200, backgroundColor: '#eeeeee' }, this.props.style]}
            onLayout={(e) => { UIManager.measure(e.target, (x, y, width, height, pageX, pageY) => { this.topy = pageY; this.leftx = pageX }) }}>
            <Surface height={this.props.style.height} width={this.props.style.height}>
                <Shape d={this.state.path} stroke='red' strokeWidth={this.props.strokeWidth}
                />
            </Surface>
            <Animated.View
                {... this.beginThumbResponder.panHandlers}
                style={{
                    height: this.props.SliderStyle.height, width: this.props.SliderStyle.width
                    , position: 'absolute', top: -.5 * this.props.SliderStyle.height, left: -.5 * this.props.SliderStyle.width,
                    transform: [{ translateX: this.state.beginLocation.x }, { translateY: this.state.beginLocation.y }]
                }}>
                <View style={{ height: this.props.SliderStyle.height, width: this.props.SliderStyle.width, borderRadius: this.props.SliderStyle.height * 0.5, backgroundColor: this.props.SliderStyle.backgroundColor[0] }} />
            </Animated.View>

            <Animated.View
                {...this.endThumbResponder.panHandlers}
                style={{
                    height: this.props.SliderStyle.height, width: this.props.SliderStyle.width
                    , position: 'absolute', top: -.5 * this.props.SliderStyle.height, left: -.5 * this.props.SliderStyle.width,
                    transform: [{ translateX: this.state.endLocation.x }, { translateY: this.state.endLocation.y }]
                }}>
                <View style={{ height: this.props.SliderStyle.height, width: this.props.SliderStyle.width, borderRadius: this.props.SliderStyle.height * 0.5, backgroundColor: this.props.SliderStyle.backgroundColor[1] }} />
            </Animated.View>
        </View>)
    }

    //beginAngle 开始角度， Angle 弧度  均为逆时针  0->0  2->2PI
    getLocationByArc(beginAngle, Angle) {
        let za = this.props.ZeroAngle % 2;
        let ma = this.props.MaxAngle % 2;
        if (za < 0) za += 2
        if (ma <= 0) ma += 2
        beginAngle += za;

        console.log(beginAngle, Angle, ma, za)
        if (beginAngle + Angle > ma + za) Angle = ma - beginAngle + za
        let radius = this.props.style.height * 0.5 - this.props.SliderStyle.width * 0.5;
        let dgr = Math.PI * Angle;
        let defaultdgr = Math.PI * beginAngle;
        let dflocationx = radius * (1 + Math.cos(defaultdgr)) + this.props.SliderStyle.width * 0.5
        let dflocationy = radius * (1 + Math.sin(defaultdgr)) + this.props.SliderStyle.width * 0.5
        let locationX = radius * (1 + Math.cos(defaultdgr + dgr)) + this.props.SliderStyle.width * 0.5
        let locationY = radius * (1 + Math.sin(defaultdgr + dgr)) + this.props.SliderStyle.width * 0.5
        let path = Path().moveTo(dflocationx, dflocationy)
            .arcTo(locationX, locationY, radius, radius, dgr > Math.PI ? 1 : 0);
        return {
            path: path, begin: { x: dflocationx, y: dflocationy }, end: { x: locationX, y: locationY }
        }

    }

    getArcByLocation(x, y) {
        let tX = x - this.props.style.width * 0.5; let tY = y - this.props.style.height * 0.5;

        let res = Math.atan(tY / tX) / Math.PI; if (tX > 0 && tY < 0) res += 2; if (tX < 0) res += 1;
        let za = this.props.ZeroAngle % 2;
        if (za < 0) za += 2
        res -= za;
        if (res > 2) res -= 2; else if (res < 0) res += 2;
        return res
    }
}
ProgressChooser.defaultProps = {
    style: { height: 200, width: 200 },//大小
    strokeWidth: 25,//进度条粗细
    defaultAngle: 0,//起始角度
    Angle: 0.5,//进度弧度大小
    SliderStyle: {
        height: 35, width: 35, backgroundColor: ['blue', 'green']
    },//Thumb样式
    ZeroAngle: -3.2,
    MaxAngle: 2
}