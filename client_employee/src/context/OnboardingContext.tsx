import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import axiosInstance from '../interceptors/axiosInstance.tsx';
import { EmployeeInfo } from '../types/EmployeeInfo.tsx';
import { FileData } from '../types/FileData.tsx';

interface OnboardingContextType {
    onboardingData: EmployeeInfo | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    optReciept: string | null;
    files: { [key: string]: FileData };
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [onboardingData, setOnboardingData] = useState<EmployeeInfo | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [optReciept, setOptReciept] = useState<string | null>(null);
    const [files, setFiles] = useState<{ [key: string]: FileData }>({});
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (token && location.pathname !== '/login' && !location.pathname.startsWith('/register')) {
                try {
                    setIsLoading(true);
                    const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/onboarding`);
                    setOnboardingData(response.data);
                    setIsLoggedIn(true);
                } catch (error: any) {
                    if (error.response && error.response.data && error.response.data.message) {
                        const errorMessage = error.response.data.message;
                        alert('Failed to fetch onboarding data: ' + errorMessage);
                    }
                    setIsLoggedIn(false);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoggedIn(false);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [location.pathname]);

    useEffect(() => {
        const fetchOptReciept = async () => {
            try {
                const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/opt`);
                const data = response.data;
                setOptReciept(data.optreciept);
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    alert('Failed to fetch opt reciept: ' + errorMessage);
                }
            }
        };

        const fetchFiles = async () => {
            const fileKeys: { [name: string]: string } = {};
            if (onboardingData && typeof onboardingData.picture === 'string' && onboardingData.picture !== '') {
                fileKeys['picture'] = onboardingData.picture;
            }

            if (onboardingData && onboardingData.license && typeof onboardingData.license.licensefile === 'string' && onboardingData.license.licensefile !== '') {
                fileKeys['license'] = onboardingData.license.licensefile as string;
            }

            if (optReciept) {
                fileKeys['optreciept'] = optReciept;
            }

            const newUploadedFiles: { [key: string]: FileData } = {};
            try {
                await Promise.all(Object.keys(fileKeys).map(async (name) => {
                    const fileKey = fileKeys[name];
                    const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/file/${fileKey}`);
                    const data = response.data;
                    newUploadedFiles[name] = {
                        fileKey: fileKey,
                        url: data.url,
                        filename: data.filename,
                        status: data.status,
                        name: name
                    };
                }));

                setFiles(newUploadedFiles);
            } catch (error: any) {
                if (error.response) {
                    const errorMessage = error.response;
                    alert('Failed to fetch uploaded files: ' + errorMessage);
                }
            }
        };

        if (onboardingData) {
            fetchOptReciept().then(fetchFiles);
        }
    }, [onboardingData, optReciept]);

    return (
        <OnboardingContext.Provider value={{ onboardingData, optReciept, files, isLoading, isLoggedIn, setIsLoggedIn }}>
            {children}
        </OnboardingContext.Provider>
    );
};