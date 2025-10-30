"use client"
import { useState, useEffect } from 'react';
import { Button, message, Space } from 'antd';
import { StudentTypes } from '@/utils/Types';
import { StudentForm, TableComponents, EditStudentForm } from './exportComponents';

function StudentsTable() {
    const [ students, setStudents ] = useState<StudentTypes[]>([
        {
            id: "0",
            name: "No_name",
            nis: "000000",
            class_name: "0",
            major: "No_major",
            status: "active"
        }
    ]);
    const [ loading, setLoading ] = useState(true);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ isEditModalVisible, setIsEditModalVisible ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ messageApi, contextHolder ] = message.useMessage();
    const [ currentStudent, setCurrentStudent ] = useState<StudentTypes>(
        {
            id: "0",
            name: "No_name",
            nis: "000000",
            class_name: "0",
            major: "No_major",
            status: "active"
        }
    )

    async function getStudents() {
        try {
            const response = await fetch('/api/students', {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            const result: any = await response.json()

            if(result.body['is_success']) {
                setStudents(result.body.data)
            }
        } catch (err) {
            console.log(err)
            messageApi.error("Failed to get student data.");
        }
    }

    async function loadStudents() {
        setLoading(true);

        try {
            getStudents()
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            messageApi.error("Failed to load student data.");
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            {contextHolder}
            <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">Student Data Management</h1>

                <Space size="middle" className="mb-6 w-full justify-between">
                    <Button
                        type="primary"
                        onClick={() => setIsModalVisible(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-lg text-lg font-medium shadow-md"
                    >
                        Add Student
                    </Button>

                    <Button
                        onClick={() => {
                            loadStudents();
                            messageApi.success("Table refreshed.")
                        }}
                        disabled={loading || isSubmitting}
                        loading={loading}
                        className="border-gray-300 text-gray-600 hover:text-indigo-600 hover:border-indigo-600 h-10 px-4 rounded-lg"
                    >
                        Refresh
                    </Button>
                </Space>
                
                <TableComponents 
                    students={students} 
                    setStudents={setStudents}
                    loading={loading} 
                    loadStudents={loadStudents}
                    setIsEditModalVisible={setIsEditModalVisible}
                    setCurrentStudent={setCurrentStudent}
                />
                
                <StudentForm 
                    students={students}
                    setStudents={setStudents}
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                />

                <EditStudentForm 
                    students={students}
                    setStudents={setStudents}
                    isEditModalVisible={isEditModalVisible}
                    setIsEditModalVisible={setIsEditModalVisible}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    currentStudent={currentStudent}
                    setCurrentStudent={setCurrentStudent}
                />

            </div>
        </div>
    );
};

export default StudentsTable;
