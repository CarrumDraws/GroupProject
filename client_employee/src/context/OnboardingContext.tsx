import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../interceptors/axiosInstance';
import EmployeeInfo from '../types/EmployeeInfo';

interface OnboardingContextType {
    onboardingData: EmployeeInfo | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
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
                } catch (error) {
                    console.error('Failed to fetch onboarding data:', error);
                    setIsLoggedIn(false);
                } finally{
                    setIsLoading(false);
                }
            } else {
                setIsLoggedIn(false);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [location.pathname]);

    return (
        <OnboardingContext.Provider value={{ onboardingData, isLoading, isLoggedIn, setIsLoggedIn }}>
            {children}
        </OnboardingContext.Provider>
    );
};