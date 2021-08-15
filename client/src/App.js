
import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateUser from "./CreateUser";
import LeaderBoard from "./Leaderboard";
import PostMoney from "./PostMoney";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App = () => {
  const [id, setId] = useState('');
  const [top100, setTop100] = useState([]);
  const [userRank, setUserRank] = useState([]);
  const onClick = async (item)=>  {
    console.log(item);
    const res = await axios.get(
      `http://localhost:4000/api/v1/users/${item}`
    );
  
    //console.log(res.data.data);
    setTop100(res.data.data.top100);
    setUserRank(res.data.data.userRank);
    setId(item[0])
  }

  const fetchData = async () => {
    // console.log('calling');
     try {
       const res = await axios.get(
       `http://localhost:4000/api/v1/users`
     );
   
     //console.log(res.data.data);
     setTop100(res.data.data.top100);
     setUserRank(res.data.data.userRank);
     
   }catch(e){
     console.log(e);
   }
 }
    
 
   useEffect(() => {
     fetchData();
   }, []);
  return (
    
    <div className="container">
     
      <Row >
          <Col>
              <h1> Leaderboard </h1>
              <LeaderBoard onClick={onClick} users={top100}/>
          </Col>
          <Col> 
          <h3>Send Money</h3>
            <hr/>
            <PostMoney id={id}/>

            <hr/>
              <h3>Create User</h3>
              <hr/>
              <CreateUser/>

          </Col>
          </Row>  
       <hr/>       
       <h1> User In Ranks </h1>
            <LeaderBoard onClick={onClick} users={userRank}/>
    </div>
  )
};

export default App;
