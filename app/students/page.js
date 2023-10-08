"use client"
import { useState } from "react";
import '../page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '@/app/assets/images/logo.jpg'
import { collection, addDoc, getDocs, doc } from "firebase/firestore"; 
import {db} from "@/config/firebase";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;

// const [students, setStudents] = useState([]);

const addClickHandler = async ()=>{
   try {
    const collectionArg = collection(db, "students");
    const docRef = await addDoc(collectionArg, {
      stdName: 'Ali',
      stdEmail: 'ali@gmail.com',
      stdRollNum: '91948',
      contactNum: '0987654321'
    })
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

const getClickHandler = async ()=>{

  const querySnapshot = await getDocs(collection(db, "students"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });

}


export default function Home() {
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
          Content
        </Content>
      </Layout>
    </Layout>



      {/* <button onClick={addClickHandler}>Add Button</button> 
      <button onClick={getClickHandler}>Get Button</button>  */}
    </>
  )
}
