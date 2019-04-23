import React from 'react';
import logo from './logo.svg';
import './App.css';

function GridCell(props){
  var style = {
    width:20,
    height: 20,
    border:'1px solid black',
    backgroundColor:props.cell
  }
  return (
    <div style = {style}>
    </div>
  )
}

function GridRow(props){
  var style = {
    display: "flex"
  }
  return (
    <div style = {style}>
      {
        props.row.map((cell)=>{
          return <GridCell cell={cell}/>
        })
      }
    </div>
  )
}

function Grid (props){

  return (
    <div>
      {
        props.grid.map( (row) => {
          return <GridRow row = {row}/>
        })
      }

    </div>
  )
}

class Game extends React.Component{
  constructor(props){
    super(props)

    var grid = []
    for(let i = 0; i < 20; i++){
      grid.push(new Array(30).fill('lightgreen'))
    }
    var bird = {
      height:10,
      position:2,
    }
    var towers = [
      {position:3,height:6,upright:false},
      {position:7,height:8,upright:true},
      {position:14,height:7,upright:false},
      {position:17,height:7,upright:true},
      {position:27,height:9,upright:false},
      {position:32,height:8,upright:true},
      {position:23,height:5,upright:false},
      {position:11,height:6,upright:true},
    ]
    grid[bird.height][bird.position] = 'mediumblue'

    this.state = {grid:grid,bird:bird,towers:towers, crashed:false, score:0}

    this.timerID = setInterval(()=>{
      if(this.state.crashed)
        return
      var gridCopy = []
      var towersCopy = this.state.towers.slice()
      for(let i = 0; i < 20; i++){
        gridCopy.push(new Array(30).fill('tan'))
      }

      for(let i = 0; i < towersCopy.length; i++){
        towersCopy[i].position--
        if(towersCopy[i].position < 0 ){
          towersCopy[i].position = 29
          towersCopy[i].height = Math.floor(Math.random()*7) + 3
        }
      }

      for(let i = 0; i < towersCopy.length; i++){
        for(let j = 0; j < towersCopy[i].height; j++){
          if(towersCopy[i].upright)
            gridCopy[19-j][towersCopy[i].position] = 'green'
          else
            gridCopy[j][towersCopy[i].position] = 'green'

        }
      }
      var birdCopy = this.state.bird
      birdCopy.height++

      var crashed = false
      if(birdCopy.height > 19 || birdCopy.height < 0){
        birdCopy.height = 10
        crashed = true
      }
      for(let i = 0; i < 20; i++){
        if(gridCopy[i][2] == 'green' && birdCopy.height == i){
          birdCopy.height = 10
          crashed = true
        }
      }
      if(crashed){
        this.setState({crashed:true})
      }
      gridCopy[birdCopy.height][birdCopy.position] = 'mediumblue'

      this.setState({grid:gridCopy,bird:birdCopy,towers:towersCopy,score:this.state.score + 1})
      
    },200)
  }
  handleClick(){
    if(this.state.crashed)
      return
    var birdCopy = this.state.bird
    birdCopy.height-= 3
    this.setState({bird:birdCopy})
  }
  restart(){
    this.setState({crashed:false,score:0})
  }
  render(){
    return (
      <div onClick = {this.handleClick.bind(this)}>
        <Grid grid = {this.state.grid}/>
        {this.state.crashed? <button onClick = {this.restart.bind(this)}>Click here to restart the game...</button> : this.state.score}
      </div>
    )
  }
}
export default Game;
