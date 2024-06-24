import { useState } from 'react';

export const profileForms = (initialValues: any) => {
    const [values, setValues] = useState({
        ...initialValues
    });

    const handleChange = (event: { target: { name: string; value: string; }; }) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    }

    const resetValues = (newValues: any) => {
        setValues({...newValues});
    }

    return {
        values,
        handleChange,
        resetValues
    };
};