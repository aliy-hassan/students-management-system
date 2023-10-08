"use client"
import React, { useContext, useEffect, useRef, useState} from "react";
import './page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../app/assets/images/logo.jpg'
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore"; 
import {db} from "@/config/firebase";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Table, Form, Input, Popconfirm, Modal, Mentions} from 'antd';
const { Header, Sider, Content } = Layout;

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};


// const columns = defaultColumns.map((col) => {
//   if (!col.editable) {
//     return col;
//   }
//   return {
//     ...col,
//     onCell: (record) => ({
//       record,
//       editable: col.editable,
//       dataIndex: col.dataIndex,
//       title: col.title,
//       handleSave,
//     }),
//   };
// });


// const data = [];
// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }

// const addClickHandler = async ()=>{
//    try {
//     const collectionArg = collection(db, "students");
//     const docRef = await addDoc(collectionArg, {
//       stdName: 'Ali',
//       stdEmail: 'ali@gmail.com',
//       stdRollNum: '91948',
//       contactNum: '0987654321'
//     })
//     console.log("Document written with ID: ", docRef.id);
//   } catch (error) {
//     console.error("Error adding document: ", error);
//   }
// };

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const [stName, setName] = useState();
  const [stEmail, setEmail] = useState();
  const [stRoll, setRoll] = useState();
  const [stContact, setContact] = useState();
  const nameChangeHandler = (value) => {
    // console.log('Change:', value);
    setName(value);
  };
  const emailChangeHandler = (value) => {
    // console.log('Change:', value);
    setEmail(value);
  };
  const rollChangeHandler = (value) => {
    // console.log('Change:', value);
    setRoll(value);
  };
  const contactChangeHandler = (value) => {
    // console.log('Change:', value);
    setContact(value);
  };

  const handleOk = async () => { 
    try {
      setIsModalOpen(false);
      const collectionArg = collection(db, "students");
      const docRef = await addDoc(collectionArg, {
        stdName: stName,
        stdEmail: stEmail,
        stdRollNum: stRoll,
        contactNum: stContact
      })
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const [students, setStudents] = useState([]);
  const fetchStudents = async ()=>{
    const querySnapshot = await getDocs(collection(db, "students"));
    // console.log(querySnapshot)
    const stdnts = [];
    querySnapshot.forEach((doc) => {
      stdnts.push({key:doc.id, ...doc.data()});
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
    });
    setStudents(stdnts);
    // console.log(students)
  }

  const depend = fetchStudents();
  useEffect(()=> {
    fetchStudents()
  }, [depend])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'stdName',
    },
    {
      title: 'Student ID',
      dataIndex: 'stdRollNum',
    },
    {
      title: 'Email Address',
      dataIndex: 'stdEmail',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNum',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) =>
        students.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const [count, setCount] = useState(2);
  const handleDelete = async (key) => {
    const newData = students.filter((item) => item.key !== key);
    setStudents(newData);
    await deleteDoc(doc(db, 'students', key));
  };
  // const handleAdd = () => {
  //   const newData = {
  //     key: count,
  //     name: `Edward King ${count}`,
  //     age: '32',
  //     address: `London, Park Lane no. ${count}`,
  //   };
  //   setStudents([...students, newData]);
  //   setCount(count + 1);
  // };
  
  const handleSave = (row) => {
    const newData = [...students];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setStudents(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
    <Layout className="layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Students',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Courses',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Attendence',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
        
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {/* <div className="std-table">
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
                Reload
              </Button>
              <span
                style={{
                  marginLeft: 8,
                }}
              >
                {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
              </span>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={students} />
          </div> */}
          <div>
            <Button
              onClick={showModal}
              // onClick={handleAdd}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add Student
            </Button>
            <Table
              components={components}
              // rowClassName={() => 'editable-row'}
              bordered
              dataSource={students}
              columns={columns}
            />
          </div>``
        </Content>
      </Layout>
    </Layout>


      
      {/* <button onClick={addClickHandler}>Add Button</button> 
      <button onClick={fetchStudents}>Get Button</button>  */}
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText="Submit">
        <label htmlFor="">Student Name:</label>
        <Mentions className="inputs"
          style={{
            width: '100%',
          }}
          onChange={nameChangeHandler}
          defaultValue=""
        />
        <label htmlFor="">Student Email Address:</label>
        <Mentions className="inputs"
          style={{
            width: '100%',
          }}
          onChange={emailChangeHandler}
          defaultValue=""
        />
        <label htmlFor="">Student ID:</label>
        <Mentions className="inputs"
          style={{
            width: '100%',
          }}
          onChange={rollChangeHandler}
          defaultValue=""
        />
        <label htmlFor="">Contact:</label>
        <Mentions className="inputs"
          style={{
            width: '100%',
          }}
          onChange={contactChangeHandler}
          defaultValue=""
        />
      </Modal>
    </>
  )
}
