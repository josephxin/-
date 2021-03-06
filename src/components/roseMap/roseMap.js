import React from 'react';
import echarts from "echarts";
import './roseMap.css';
const colorArr = [{
		borderColor: '#e09e12',
		color: ['#986a2b', '#e09e12']
	},
	{
		borderColor: '#d6d911',
		color: ['#9ca528', '#d6d911']
	},
	{
		borderColor: '#29af26',
		color: ['#2c9232', '#29af26']
	},
	{
		borderColor: '#02c483',
		color: ['#029a71', '#02c483']
	},
	{
		borderColor: '#01d2ee',
		color: ['#029de0', '#01d2ee']
	},
	{
		borderColor: '#2a76dd',
		color: ['#144eec', '#2a76dd']
	},
	{
		borderColor: '#02c483',
		color: ['#029a71', '#02c483']
	},
	{
		borderColor: '#01d2ee',
		color: ['#029de0', '#01d2ee']
	},
	{
		borderColor: '#2a76dd',
		color: ['#144eec', '#2a76dd']
	},
];

/*
 * @author zhy
 * */
class RoseMap extends React.Component {
	constructor(props) {
		super(props);
		let me = this;
		me.state = {};
		me.bindResize = me._chartResize.bind(me);
	}

	_setData(d) {
		let me = this;
		me.lock = true;
		//console.log(me.lock);
		me.setState({
			data: d
		})
	}

	tooltip() {
		const me = this;
		//console.log(me.lock);
		if(me.lock) {
			me.lock = false;
			return me.state.data.legend.slice(0, 4).map((s, i) => {
				return <li key={s} style={{
            width: me.state.data.legend.length !== 3 ? '40%' : '',
            color: colorArr[i].borderColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <p style={{
            width: '.14rem',
            height: '.14rem',
            borderRadius: '50%',
            backgroundColor: colorArr[i].borderColor
          }}></p>
          <p style={{
            paddingLeft: '.1rem'
          }}>{s}</p>
        </li>
			});
		}
	}
	render() {
		const me = this;
		//console.log(me.state.data)
		let data = me.state.data
		let cssName = me.props.cssName || 'ulColor'
		return(
			<div className={ 'rose-map'+' '+'frame-style' + ' ' + me.props.name}>
				<ul className={cssName}>
					{
						data ? data.series.map((item,i)=>{
							return  (
								<li key={i} title={item.name}>
									<p className={'pColor'}></p>
									<p className={'pColorTwo'}>{item.name}</p>
								</li>
							)
						}) :''
					}
				</ul>
				
		        <div className="echarts-position" ref="pieChart"
		          style={{
		            width: this.props.width / 100 + "rem",
		            height: this.props.height / 100 + "rem",
		            top: me.props.right ? '0.35rem' : '',
		          }}
		        />
		    </div>
		)
	}

	componentWillMount() {}

	componentDidMount() {
		let me = this;
		const scale = window._scale;
		me.chart = echarts.init(this.refs.pieChart);
		me.option = {
			legend: {
				show: false,
				top: me.props.right ? '0%' : '4%',
				x: 'center',
				y: 'top',
				textStyle: {
					color: "#fff",
					fontSize: 14
				},
				icon: 'rect',
				itemWidth: 20* scale,
				itemHeight: 10* scale,
				itemGap:10* scale,
				data: []
			},
			calculable: true,
			series: [{
				z: 0,
				name: '',
				type: 'pie',
				center: ['50%', me.props.right ? '45%' : '50%'],
				radius: ['18%', '19%'],
				hoverAnimation: false,
				label: {
					normal: {
						position: 'center',
						show: false
					}
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: [{
					value: 0,
					itemStyle: {
						normal: {
							color: '#00a1be' //颜色填充
						}
					},
					tooltip: {
						show: false
					}
				}]
			}, {
				name: '',
				type: 'pie',
				center: ['50%', me.props.right ? '45%' : '50%'],
				radius: ['20%', '35%'],
				roseType: 'area', //'area'为定角南丁格尔图，'radius'为不定角南丁格尔图
				labelLine: {
					normal: {
						length: 10 * scale,
						length2: 100 * scale,
					}
				},
				data: []
			}]
		};
		me.chart.setOption(me.option);
		me.chart.resize();
	}

	componentDidUpdate() {
		let me = this;
		const scale = window._scale;
		let colors = colorArr;

		if(me.state.data) {
			me.option.series[1].data = me.state.data.series.map(function(d, i) {
				return {
					value: d.value,
					name: d.name,
					itemStyle: {
						normal: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: colors[i].color[0]
								}, {
									offset: 1,
									color: colors[i].color[1]
								}],
								globalCoord: false
							}
						}
					},
					label: {
						normal: {
							formatter: function(d) {
								let data = me.state.data.series[d.dataIndex];
								let num = Number(data.rate) || Number(d.percent);
								let name = data.name;
								if(name.length > 4) {
									name = name.substring(0,4) + '..';
								}
								return `占比{a|${num}}%\n${name}{b|${data.value}}起`;
							},
							padding: [0, -100 * scale],
							rich: {
								a: {
									color: colors[i].borderColor,
									fontSize: 18 * scale,
									lineHeight: 24 * scale
								},
								b: {
									color: colors[i].borderColor,
									fontSize: 18 * scale,
									lineHeight: 24 * scale,
								}
							},
							fontSize: 12,
							color: "#fff"
						}
					}
				}
			});
			me.option.legend.data = me.state.data.legend;
			me.chart.setOption(me.option);
		}
	}

	resize() {
		this._chartResize();
		this.componentDidMount();
		this.componentDidUpdate();
	}

	_chartResize() {
		const me = this;
		const scale = window._scale;
		me.chart.resize();
	}
}

export default RoseMap;