import '../styles/ShelfLabel.scss';


import React, { Component } from 'react';
var Barcode = require('react-barcode');


const  LABELS_PER_ROW = 2; 
const ROWS_PER_PAGE = 3;

function Label(props){
  
  let index = props.label + (props.row * LABELS_PER_ROW) + ((props.page * (LABELS_PER_ROW+ROWS_PER_PAGE)) + props.page); 
  //I wonder if this logic works for any value for LABELS_PER_ROW and ROWS_PER_PAGE

  let barcodeOptions = {
                width: 2,
                height: 30,
                format: "CODE128",
                displayValue: true,
                fontOptions: "",
                font: "monospace",
                textAlign: "center",
                textPosition: "bottom",
                textMargin: 2,
                fontSize: 20,
                background: "#ffffff",
                lineColor: "#000000",
                margin: 10,
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0
  };
  
  if(index >= props.table.length) return <div className='Label'></div>; //Return empty label div to avoid array out of bounds error
  //change header keys here to display correct info from csv file
  return (<div className='label' > 
            <table>
              <tbody>
                <tr><td className="supplier">{props.table[index].supplier}</td></tr>
                <tr><td className="description">{props.table[index].description}</td></tr>
                <tr><td className="barcode"><Barcode value={props.table[index].part_number.replace(/\s+/g, '')} {...barcodeOptions} /></td></tr>
              </tbody>
            </table>
            </div>);
}

function Row(props){
  let labels = []
  for(let i = 0 ; i < LABELS_PER_ROW ; i++){
    labels.push(<Label key={i} label={i} {...props} />);
  }

  return (<div className='label_row'> {labels} </div>)
}

function Page(props){
  
  let rows = [];
  for(let i = 0 ; i < ROWS_PER_PAGE ; i++){
    rows.push(<Row key={i} row={i} {...props} />);
  }
  return (<div className='label_page'> {rows} </div>)
}

function Display(props){
  
  let numberOfPages = parseInt(props.table.length / 6);
  if((props.table.length % 6) !== 0) numberOfPages += 1;
  
  let pages = [];
  for (let i = 0 ; i < numberOfPages ; i++){
    pages.push(<Page key={i} page={i} {...props }/>);
  }

  return (<div> {pages} </div>)
}

class ShelfLabelPrint extends Component {
  
  constructor(props){
    super(props);
    this.state = {
     
    };
    
  }
  
  render() {return <Display {...this.props } />};
}
  export default ShelfLabelPrint;
  