import React, {useState } from 'react';

import axios from 'axios';
import DatePicker from "react-datepicker";
import moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";

const refreshPage = ()=>{
    window.location.reload();
 }

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {

const [name, setName] = useState('');
const [dob, setDOB] = useState('');

const onSubmit = async (event) => {
    event.preventDefault();

    const d = new Date(dob);
    await axios.post('http://localhost:4000/api/v1/users',
    {
        name,
        dob:moment(d).format('DD-MM-YYYY')
    });

    refreshPage();
}
return <div>
    
        <form onSubmit={onSubmit}>
            <div className="form-group">  
            <label>Name</label>
                <input  value= {name} onChange={e => setName (e.target.value)} className="form-control Name"/>
            <label>Date of Birth</label>
            <DatePicker selected={dob} onChange={(date) => setDOB(date)} />
            <button className="btn btn-primary">Submit</button>
            
            </div>
        
        </form>
    </div>
}