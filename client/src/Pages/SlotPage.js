import React, { useState } from "react";
import axios from "axios";
import './Stylesheets/Slots.css'

function Toast({message, type}){
    return <div className={`Toast-box ${type}`}>{message}</div>;
}

function SlotPg() {
    const today = new Date();
    const [date, setDate] = useState(today.getDate());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [slots, setSlots] = useState([]);
    const [toast, setToast] = useState(null);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 1 }, (_, i) => today.getFullYear());

    const handleCheck = async () => {
        const selectedDate = `${year}-${String(month).padStart(2, 0)}-${String(date).padStart(2, 0)}`;

        try {
            const res = await axios.post(`http://localhost:5000/api/slot`, { selectedDate });
            console.log(res.data);
            setSlots(res.data);
            showtoast("Data fetched Successfully");
        } catch (err) {
            console.log(err);
            showtoast("Failed to fetch Data","error");
        }
    }

    const showtoast = (message, type ="success") => {
        setToast({message,type})
        setTimeout(() => setToast(null),3000);
    }

    return (
        <>
            <div className='Pg-body'>
                <div className='Select-box'>
                    <h1>Booked Slot</h1>
                    <div className="date-container">
                        <select
                            className="date-box"
                            id="dateb"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        >
                            {days.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                        <select
                            className="date-box"
                            id="monthb"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            {
                                months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))
                            }
                        </select>
                        <select
                            className="date-box"
                            id="yearb"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="check-btn" onClick={handleCheck}>CHECK</button>
                </div>
                <div className="display-box">
                    <h1>Occupied Time Slots</h1>
                    {slots.length === 0 ? (
                        <p>No Slot Booked For the Day</p>
                    ) : (<table className="slot-table">
                        <thead>
                            <th>S.No.</th>
                            <th>Request ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>EventType</th>
                            <th>Status</th>
                        </thead>
                        <tbody>
                            {slots.map((slot, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{slot.Request_id || '-'}</td>
                                    <td>{slot.EventDate || '-'}</td>
                                    <td>{slot.StartTime} - {slot.EndTime}</td>
                                    <td>{slot.EventType|| '-'}</td>
                                    <td>{slot.Status || 'Free'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div >
                {toast && <Toast message={toast.message} type={toast.type} />}
            </div >
        </>
    );

}

export default SlotPg;