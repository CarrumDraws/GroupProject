import { useEffect, useState } from "react";
import { Box, Typography } from '@mui/material';
import { useProfile } from '../context/ProfileContext.tsx';
import LoadingScreen from './LoadingScreen.tsx';
import axiosInstance from '../interceptors/axiosInstance.tsx';

interface FileData {
    fileKey: string;
    url: string;
    filename: string;
}

const Documents = () => {
    const [fileArr, setFileArr] = useState<FileData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { files } = useProfile();

    useEffect(() => {
        const fetchFiles = async () => {
            const newFileArr: FileData[] = [];
            try {
                await Promise.all(files.map(async (fileKey) => {
                    const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/file/${fileKey}`);
                    const data = await response.data;
                    newFileArr.push({ fileKey, url: data.url, filename: data.filename });
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
            return <iframe src={url} style={{ width: '100%', height: '500px' }} />;
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
            {fileArr.length > 0 && (
                <Box sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <img 
                        src={fileArr[0].url} 
                        alt="Profile Pic" 
                        style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                    />
                </Box>
            )}
            <Typography paddingTop='1rem' fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Documents</Typography>
            {fileArr.slice(1).map(({ fileKey, url, filename }) => (
                <Box key={fileKey} sx={{ margin: '1rem', textAlign: 'center' }}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {renderFilePreview({ fileKey, url, filename })}
                    </a>
                    <Typography>{filename}</Typography>
                </Box>
            ))}
        </Box>
    );
}

export default Documents;