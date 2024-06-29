export interface File {
    open(): unknown;
    _id: string;
    employee_id: string;
    url: string;
    filename: string;
    filekey: string;
    status: string;
    notification_sent: string;
    feedback: string;
}