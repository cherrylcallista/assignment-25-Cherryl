import { StudentTypes, NewStudentDataTypes } from "@/utils/Types";
import { Modal, Button, Form, Input, message } from "antd"

type StudentFormTypes = {
    students: StudentTypes[],
    setStudents: React.Dispatch<React.SetStateAction<StudentTypes[]>>, 
    isModalVisible: boolean,
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    isSubmitting: boolean,
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
}

function StudentForm({ students, setStudents, isModalVisible, setIsModalVisible, isSubmitting, setIsSubmitting }: StudentFormTypes) {
    const [ form ] = Form.useForm()
    const [ messageApi, contextHolder ] = message.useMessage();

    async function addStudent(values: NewStudentDataTypes) {
        const body = { ...values }

        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
        
        const isSuccess = response.ok || response.status === 201; 
        
        if (!isSuccess) { 
            const errorBody = await response.json().catch(() => ({}));
            const errorMessage = errorBody.message || `Server error (Status: ${response.status})`;
            throw new Error(errorMessage);
        }
        
        const result: any = await response.json(); 
        
        if (result.body['is_success']) {
            setStudents([ ...students, result.body.data ])
        } else {
            const backendMessage = result?.data?.body?.message || 'Student was not added due to a server logic error.';
            throw new Error(backendMessage);
        } 
    }

    async function onFinish(values: NewStudentDataTypes) {
        setIsSubmitting(true);

        try {
            await addStudent(values);
        
            messageApi.success(`Successfully added student: ${values.name}`); 
            setIsModalVisible(false); 
            form.resetFields();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            messageApi.error(`Submission failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={<div className="text-xl font-semibold text-indigo-700">Add New Student</div>}
            open={isModalVisible}
            onCancel={() => { if (!isSubmitting) setIsModalVisible(false); }} 
            footer={[
                <Button 
                    key="back" 
                    onClick={() => setIsModalVisible(false)} 
                    disabled={isSubmitting}
                    className="rounded-lg"
                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    onClick={() => form.submit()}
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                    Submit Student
                </Button>,
            ]}
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                name="add_student_form"
                onFinish={onFinish}
                className="pt-4"
            >
                <Form.Item
                    name="name"
                    label="Student Name"
                    rules={[{ required: true, message: 'Please input the student name!' }]}
                >
                    <Input placeholder="Input your name" className="rounded-lg p-2" />
                </Form.Item>

                <Form.Item
                    name="nis"
                    label="NIS (Student ID)"
                    rules={[{ required: true, message: 'Please input the NIS (Student ID)!' }]}
                >
                    <Input placeholder="Input your NIS" className="rounded-lg p-2" />
                </Form.Item>

                <Form.Item
                    name="class_name"
                    label="Class"
                    rules={[{ required: true, message: 'Please input the class!' }]}
                >
                    <Input placeholder="Input your class" className="rounded-lg p-2" />
                </Form.Item>

                <Form.Item
                    name="major"
                    label="Major"
                    rules={[{ required: true, message: 'Please input the major!' }]}
                >
                    <Input placeholder="Input your major" className="rounded-lg p-2"/>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default StudentForm