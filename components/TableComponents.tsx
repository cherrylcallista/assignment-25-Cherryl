import { StudentTypes } from "@/utils/Types";
import { Table, Tag, Spin, Button, Space, message } from "antd"

type TableComponentsTypes = {
    students: StudentTypes[],
    setStudents: React.Dispatch<React.SetStateAction<StudentTypes[]>>,
    loading: boolean,
    loadStudents: () => Promise<void>,
    setIsEditModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentStudent: React.Dispatch<React.SetStateAction<StudentTypes>>,
}

function TableComponents({ students, setStudents, loading, loadStudents, setIsEditModalVisible, setCurrentStudent }: TableComponentsTypes) {
    const [ messageApi, contextHolder ] = message.useMessage()
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
        },
        {
            title: 'NIS (Student ID)',
            dataIndex: 'nis',
            key: 'nis',
            width: '20%',
            render: (nis: string) => <Tag color="blue">{nis}</Tag>,
        },
        {
            title: 'Class',
            dataIndex: 'class_name',
            key: 'class_name',
            width: '20%',
            render: (text: string) => <Tag color="geekblue">{text}</Tag>
        },
        {
            title: 'Major',
            dataIndex: 'major',
            key: 'major',
            width: '20%',
            render: (major: string) => {
                let color = major === 'IPA' ? 'green' : major === 'IPS' ? 'volcano' : 'purple';
                return <Tag color={color}>{major ? major.toUpperCase() : "No_major"}</Tag>;
                // The ? is used because I noticed there are colums that do not have major, so to prevent error from using .toUpperCase()
            },
        },
         {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'action',
            width: '20%',
            render: (_: any, record: StudentTypes) => (
                <Space>
                    <Button 
                        type="primary"
                        onClick={() => {
                            setIsEditModalVisible(true)
                            setCurrentStudent(record)
                        }}
                    >
                        Edit
                    </Button>

                    <Button 
                        type="primary" 
                        danger
                        onClick={() => removeStudents(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const filterInactiveStudents = students.filter(s => s.status !== "inactive")

    async function removeStudents(studentData: StudentTypes) {
        try {
            const body = { ...studentData, status: "inactive" }

            const response = await fetch(`/api/students?id=${studentData.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            })
            const result: any = await response.json()

            if(result.body['is_success']) {
                setStudents(() => (
                    students.filter(s => s.id !== studentData.id)
                ))
                messageApi.success(`Successfully removed student. ID: ${studentData.id}`)
                loadStudents()
            }
        } catch (err) {
            messageApi.error("Failed to remove student.")
        }
    }

    return (
        <div>
            { contextHolder }
            <Table<StudentTypes>
                columns={columns}
                dataSource={filterInactiveStudents}
                rowKey="id"
                loading={{ indicator: <Spin />, spinning: loading }}
                pagination={{ pageSize: 5 }}
                className="rounded-lg shadow-inner overflow-hidden"
            />
        </div>
    )
}

export default TableComponents
