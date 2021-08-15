import React, {useState } from 'react';
import Container from 'react-bootstrap/Container';

import io from 'socket.io-client';
const socket = io("http://localhost:4001", { transports: ['websocket', 'polling', 'flashsocket'] });


const refreshPage = ()=>{
    window.location.reload();
 }
// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
    
    const [money, setMoney] = useState('');
    const [id, setId] = useState('');

    //setId(props.id);

    const onSubmit = async (event) => {
        event.preventDefault();
        socket.emit('leaderboard',{userId: props.id, data: money});

        refreshPage();
       
    }
    return <div>
       
        <form onSubmit={onSubmit}>
            <div className="form-group">
            <Container>
                
                    <label>ID</label>
                    <input  value= {props.id} onChange={e => setId (e.target.value)} className="form-control Name"/>
                    <label>Amount</label>
                    <input  value= {money} onChange={e => setMoney (e.target.value)} className="form-control Name"/>  
                    <button className="btn btn-primary">Submit</button>
                
                </Container>
                </div>
               
        </form>
    </div>
}