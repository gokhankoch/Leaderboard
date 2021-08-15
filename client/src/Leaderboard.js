import React from "react";

import { DataGrid } from '@material-ui/data-grid';
import moment from 'moment'
const columns = [

  { field: 'index', headerName: 'Index', width: 10 },
  { field: 'id', headerName: 'ID', width: 150 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
   
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 150,
    
  },
  {
    field: 'score',
    headerName: '$',
    type: 'number',
    width: 150,
    
  },
  {
    field: 'lastday',
    headerName: '+/-',
    type: 'number',
    width: 150,
    
  },
 
];



export function LeaderBoard(props) {

 const rows = [];

let k = 1;
  for(let i = 0; i < props.users.length ; i++) {
    const indexParse = props.users[i].index.split(':');
   // console.log(indexParse);
  
    const row = {
              index : k++,          
              id: props.users[i].index,
              name: indexParse[1],
              age: moment().diff(moment(indexParse[2], 'DDMMYYYY'), 'years'),
              score: props.users[i].score,
              lastday: props.users[i].change
            }

            console.log(row);
    rows.push(row);
    
  }
//console.log(rows);
 
  return (
    <div style={{ height: 600 , width: 800}}>
      
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
      
        onSelectionModelChange={itm => props.onClick(itm)}
        
      />
      
    </div>

  );
}
export default LeaderBoard;