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
