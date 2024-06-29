import { FileData } from "../types/FileData.tsx";
import { EmptyFormObject } from "../types/ProfileForms.tsx";

export const formatDate = (dateString: string | Date, splitter: string) => {
    let date: Date;

    // Handle MMDDYYYY format
    if (typeof dateString === 'string' && dateString.length === 8) {
        const month = parseInt(dateString.substring(0, 2), 10);
        const day = parseInt(dateString.substring(2, 4), 10);
        const year = parseInt(dateString.substring(4, 8), 10);
        date = new Date(Date.UTC(year, month - 1, day));
    } else {
        date = new Date(dateString);
    }

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // months are zero-indexed
    const day = date.getUTCDate().toString().padStart(2, '0');

    if (splitter === '-') {
        return `${year}-${month}-${day}`;
    } else {
        return `${month}${splitter}${day}${splitter}${year}`;
    }
};

export const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

export function isFileData(file: File | FileData): file is FileData {
    return (file as FileData).fileKey !== undefined;
}

export function createEmptyFormObject<T>(): EmptyFormObject<T> {
    const obj = {} as EmptyFormObject<T>;
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = '';
        }
    }
    return obj;
}

export function capitalizeFirstLetter(field: string) {
    if (!field) return field; // handle empty or null strings
    return field.charAt(0).toUpperCase() + field.slice(1);
}