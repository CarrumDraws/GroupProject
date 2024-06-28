import { useEffect, useState } from "react";

import { Box, Typography } from '@mui/material';

import { useProfile } from '../context/ProfileContext.tsx';
import { FileData } from '../types/FileData.tsx'
import LoadingScreen from './LoadingScreen.tsx';
import axiosInstance from '../interceptors/axiosInstance.tsx';

const Documents = () => {
    const [fileArr, setFileArr] = useState<FileData[]>([]);
    const [profilePic, setProfilePic] = useState<FileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { files } = useProfile();

    useEffect(() => {
        const fetchFiles = async () => {
            const newFileArr: FileData[] = [];
            try {
                await Promise.all(files.map(async (fileKey, index) => {
                    const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/file/${fileKey}`);
                    const data = await response.data;
                    const fileData = { fileKey, url: data.url, filename: data.filename };

                    // Assume the first file is always the profile picture
                    if (index === 0) {
                        setProfilePic(fileData);
                    } else {
                        newFileArr.push(fileData);
                    }
                }));
                setFileArr(newFileArr);
            } catch (e) {
                alert('Failed to fetch files');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, [files]);

    const renderFilePreview = (file: FileData) => {
        const { url, filename } = file;
        const extension = filename.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension!)) {
            return <img src={url} alt={filename} style={{ maxWidth: '100%', maxHeight: '100%' }} />;
        } else if (['mp4', 'webm', 'ogg'].includes(extension!)) {
            return <video controls src={url} style={{ maxWidth: '100%', maxHeight: '100%' }} />;
        } else if (['mp3', 'wav', 'ogg'].includes(extension!)) {
            return <audio controls src={url} />;
        } else if (extension === 'pdf') {
            return <iframe src={url} style={{ width: '70%', height: '172px' }} />;
        } else {
            return <Typography>Unsupported file type: {filename}</Typography>;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '20%' }}>
                <LoadingScreen />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
            {profilePic && (
                <Box sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <img 
                        src={profilePic.url} 
                        alt="Profile Pic" 
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                    />
                </Box>
            )}
            <Typography paddingTop='1rem' fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Documents</Typography>
            {fileArr.map(({ fileKey, url, filename }) => (
                <Box key={fileKey} sx={{ margin: '1rem', textAlign: 'center' }}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {renderFilePreview({ fileKey, url, filename })}
                        <Typography sx={{ color: 'black', textDecoration: 'none' }}>{filename}</Typography>
                    </a>
                </Box>
            ))}
        </Box>
    );
}

export default Documents;