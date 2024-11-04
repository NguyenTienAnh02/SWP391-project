import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Select, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Link } from "react-router-dom";
import Header from "../component/Header";
import {Container} from "react-bootstrap";

const { Text } = Typography;
const { Option } = Select;

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Define the time ranges for each slot
const initialDataSource = [
    { key: '0', slot: 'Slot 1', time: '07:00-09:50', Mon: '', Tue: '', Wed: '', Thu: '', Fri: 'React JS', Sat: '', Sun: '' },
    { key: '1', slot: 'Slot 2', time: '10:00-12:20', Mon: 'React JS', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' },
    { key: '2', slot: 'Slot 3', time: '12:50-15:10', Mon: '', Tue: '', Wed: 'React JS', Thu: '', Fri: '', Sat: '', Sun: '' },
    { key: '3', slot: 'Slot 4', time: '15:20-17:40', Mon: 'React JS', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '', Sun: '' },
    // Add more rows based on the full schedule
];
const columns = [
    {
        title: 'Slot',
        dataIndex: 'slot',
        key: 'slot',
        width: 100,
        fixed: 'left',
        render: (text, record) => (
            <div>
                <strong>{text}</strong>
                <div style={{ fontSize: 12, color: '#999' }}>{record.time}</div>
            </div>
        ),
    },
    ...days.map((day) => ({
        title: day,
        dataIndex: day,
        key: day,
        render: (text) => (
            text ? (
                <div style={{ justifyContent:'center'}}>
                    <Link to={'/mentee/list'} style={{marginLeft:'30px'}}>{text}</Link>
                    <div style={{marginLeft:'', marginTop:'4px'}}>
                        <Button size="small" icon={<EyeOutlined />} style={{ left:-10 }}>View Materials</Button><br/>
                        <Tag style={{marginLeft:'35px', marginTop:'8px'}} color={day === 'Tue' || day === 'Fri' ? 'red' : 'green'}>
                            {day === 'Thu' || day === 'Fri' ? 'Full' : 'Enroll'}
                        </Tag>
                    </div>
                </div>
            ) : '-'
        ),
    })),
];

const ScheduleTable = () => {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [dataSource, setDataSource] = useState(initialDataSource);
    const [weekOptions, setWeekOptions] = useState([]);

    useEffect(() => {
        // Generate weekly date ranges for the year 2024
        const year = 2024;
        const startDate = moment(`${year}-01-01`).startOf('week').add(1, 'days'); // Start on Monday of the first week
        const weeks = [];

        for (let i = 0; i < 52; i++) {
            const weekStart = startDate.clone().add(i * 7, 'days');
            const weekEnd = weekStart.clone().add(6, 'days');
            const weekRange = `${weekStart.format('DD/MM')} To ${weekEnd.format('DD/MM')}`;
            weeks.push({ label: weekRange, value: weekRange });
        }
        setWeekOptions(weeks);
    }, []);

    const handleWeekChange = (value) => {
        setSelectedWeek(value);
        console.log("Selected week:", value);
    };

    return (
        <Container>
            <Header/><br/><br/><br/>
            <h1 style={{marginTop: '40px'}}>Activities for Mentor 1</h1><br/>
            <div >
                <div style={{marginBottom: '20px'}}>
                    <Select
                        placeholder="Select Week"
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        style={{width: 200}}
                    >
                        {weekOptions.map((week) => (
                            <Option key={week.value} value={week.value}>
                                {week.label}
                            </Option>
                        ))}
                    </Select>
                    {selectedWeek && (
                        <Text style={{marginLeft: '20px'}}>
                            Selected Week: {selectedWeek} of 2024
                        </Text>
                    )}
                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    pagination={false}
                    scroll={{x: '100%'}}
                />
            </div>

        </Container>
    );
};

export default ScheduleTable;
