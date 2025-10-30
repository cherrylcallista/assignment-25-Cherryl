type StudentTypes = {
    id: string;
    name: string;
    nis: string; 
    class_name: string;
    major: string;
    status: "active" | "inactive"
}

type NewStudentDataTypes  = {
    name: string;
    nis: string;
    class: string;
    major: string;
}

export type { StudentTypes, NewStudentDataTypes }