import React, { useState } from 'react';
import {Table, Avatar, Radio, Button} from 'antd';
import {Container} from "react-bootstrap";
import Header from "../component/Header";
import { useNavigate } from 'react-router-dom';

const data = [
    {
        key: '1',
        index: 1,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE150229',
        code: 'Đặng',
        surname: 'Mạnh',
        middleName: 'Cường',
        givenName: ''
    },
    {
        key: '2',
        index: 2,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE160037',
        code: 'Trần',
        surname: 'Trung',
        middleName: 'Kiên',
        givenName: ''
    },
    {
        key: '3',
        index: 3,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE160198',
        code: 'Phạm',
        surname: 'Đức',
        middleName: 'Mạnh',
        givenName: ''
    },
    {
        key: '4',
        index: 4,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE160691',
        code: 'Nguyễn',
        surname: 'Năng',
        middleName: 'Huy',
        givenName: ''
    },
    {
        key: '5',
        index: 5,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE160887',
        code: 'Vương',
        surname: 'Sỹ',
        middleName: 'Duy',
        givenName: ''
    },
    {
        key: '6',
        index: 6,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE161115',
        code: 'Nguyễn',
        surname: 'Cao',
        middleName: 'Sơn',
        givenName: ''
    },
    {
        key: '7',
        index: 7,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE161115',
        code: 'Nguyễn',
        surname: 'Cao',
        middleName: 'Sơn',
        givenName: ''
    },
    {
        key: '8',
        index: 8,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE161115',
        code: 'Nguyễn',
        surname: 'Cao',
        middleName: 'Sơn',
        givenName: ''
    },
    {
        key: '9',
        index: 9,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE161115',
        code: 'Nguyễn',
        surname: 'Cao',
        middleName: 'Sơn',
        givenName: ''
    },
    {
        key: '10',
        index: 10,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE161115',
        code: 'Nguyễn',
        surname: 'Cao',
        middleName: 'Sơn',
        givenName: ''
    },
    {
        key: '11',
        index: 11,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE161115',
        code: 'Nguyễn',
        surname: 'Cao',
        middleName: 'Sơn',
        givenName: ''
    },
    {
        key: '12',
        index: 12,
        image: 'https://via.placeholder.com/100', // Replace with actual image URL
        member: 'HE161115',
        code: 'Nguyễn',
        surname: 'Cao',
        middleName: 'Sơn',
        givenName: ''
    },
    // Add more rows as needed
];

const MemberTable = () => {
    const [tableData, setTableData] = useState(data);
    const navigate = useNavigate();

    const handleStatusChange = (e, record) => {
        // Update the status of the specific row
        const updatedData = tableData.map((item) =>
            item.key === record.key ? { ...item, status: e.target.value } : item
        );
        setTableData(updatedData);
    };
    const handleBack = () => {
        navigate('/schedule/mentor');
    };

    const columns = [
        {
            title: 'INDEX',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
        },
        {
            title: 'IMAGE',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <Avatar src={image} size={64} />,
            align: 'center',
        },
        {
            title: 'MEMBER',
            dataIndex: 'member',
            key: 'member',
            align: 'center',
        },
        {
            title: 'FIRST NAME',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
        },
        {
            title: 'MIDDLE NAME',
            dataIndex: 'surname',
            key: 'surname',
            align: 'center',
        },
        {
            title: 'LAST NAME',
            dataIndex: 'middleName',
            key: 'middleName',
            align: 'center',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status, record) => (
                <Radio.Group
                    value={status}
                    onChange={(e) => handleStatusChange(e, record)}
                >
                    <Radio value="attended">Attended</Radio>
                    <Radio value="absent">Absent</Radio>
                </Radio.Group>
            ),
        },
        {
            title: 'GIVEN NAME',
            dataIndex: 'givenName',
            key: 'givenName',
            align: 'center',
        },
    ];

    return (
        <Container>
            <Header/>
            <div style={{marginTop:'100px',padding: '20px'}}>
                <Table
                    dataSource={tableData}
                    columns={columns}
                    bordered
                    pagination={false}
                    rowKey="key"
                    style={{textAlign: 'center'}}
                />
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <Button className={'btn-success'} style={{marginRight: '20px'}} onClick={handleBack}>Save </Button>
                    <Button  className={'btn-danger'} style={{marginLeft: '20px'}} onClick={handleBack}>Back </Button>
                </div>
            </div>
        </Container>
    );
};

export default MemberTable;
