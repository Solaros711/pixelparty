import React from 'react'
import {Bar} from 'react-chartjs-2'


export default class ScoreChart extends React.Component {
    constructor (props) {
        super(props)
        const score = props.score
        const labels = []
        const data = []
        for (let name in score) {
            labels.push (name)
        }
        for (let name in score) {
            data.push (score[name])
        }

        this.state = {
            labels,
            data     
        }
    }
    
    render () {   
        return (
            <div id="score-chart">
                <Bar
                    data=  {{
                    labels: this.state.labels,
                    datasets: [{
                        label: 'Scores',
                        data: this.state.data,
                        backgroundColor: [
                            'rgb(64, 199, 40)', 
                            'rgb(162, 101, 245)',
                            'rgb(243, 214, 8 )',
                            'rgb(8, 214, 243)',
                            'rgb(98, 136, 243)',
                            'rgb(243, 8, 22)',
                        ],
                        borderColor: [
                            'rgb(64, 199, 40)',
                            'rgb(162, 101, 245)',
                            'rgb(243, 214, 8 )',
                            'rgb(8, 214, 243)',
                            'rgb(98, 136, 243)',
                            'rgb(243, 8, 22)',
                            // 'rgb(0, 0, 0)',
                        ], 
                        
                    }]
                }}
                    options= {{
                        responsive:true,
                        maintainAspectRatio: false,
                        // title: {
                        //     display: true,
                        //     text: 'Game Scores',
                        //     font: {
                        //         color: 'whitesmoke',
                        //         size: 20,
                        //     }
                        // },
                        legend: {
                            display: false
                        },
                        scales: {
                        xAxes: [{
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: true,
                                fontSize: 20,
                                // fontColor: 'gray',
                                fontColor: 'whitesmoke',
                                // fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false,
                                drawBorder: false,
                            },
                            ticks: {
                                display: true,
                                fontSize: 15,
                                // fontColor: 'gray',
                                fontColor: 'whitesmoke',
                                beginAtZero: true,
                                callback: function(value) {if (value % 1 === 0) {return value}},
                            }
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem) {
                                    return tooltipItem.yLabel;
                            }
                        }
                    }
                    }}  
                />
            </div> 
        )
    }
}