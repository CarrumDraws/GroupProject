import { useEffect, useState } from "react";

import { Box, Typography } from '@mui/material';

import axiosInstance from "../interceptors/axiosInstance.tsx";
import { FileData } from '../types/FileData.tsx';
import LoadingScreen from "./LoadingScreen.tsx";

type DocumentsProps = {
    fileKeysAndNames: FileData[]
}

// NOTE: fileKeys here in the parameter is just a FileData array
// with only fileKey and name in the FileData, which says it needs
// to be updated with data from GET file before use
const Documents: React.FC<DocumentsProps> = ({ fileKeysAndNames }) => {
    const [fileData, setFileData] = useState<FileData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFiles = async () => {
            const newFileData: FileData[] = [];

            try {
                await Promise.all(fileKeysAndNames.map(async (fileKeyAndName) => {
                    const fileResponse = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/file/${fileKeyAndName.fileKey}`);
                    const data = await fileResponse.data;
                    const fileData: FileData = { fileKey: fileKeyAndName.fileKey, url: data.url, filename: data.filename, status: data.status, name: fileKeyAndName.name };

                    // Assume the first file is always the profile picture
                    if(fileData.status == 'Approved' || fileData.name === 'license'){
                        newFileData.push(fileData);
                    }
                }));

                setFileData(newFileData);
            } catch (e : any) {
                if (e.response && e.response.data) {
                    const errorMessage = e.response.data;
                    alert('Error fetching profile picture: ' + errorMessage);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, [fileKeysAndNames]);

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
        <>
            <Typography fontSize='1.3rem' color='#8696A7' paddingTop='1rem' paddingBottom='1rem' sx={{ textDecoration: 'underline' }}>Approved Documents</Typography>

            <Box sx={{ height: '100vh', overflowY: 'auto' }}>
            {fileData.map(({ fileKey, url, filename, status, name }) => (
                <Box key={fileKey} sx={{ margin: '1rem', textAlign: 'center' }}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {renderFilePreview({ fileKey, url, filename, status, name })}
                        <Typography sx={{ color: 'black', textDecoration: 'none' }}>{filename}</Typography>
                    </a>
                </Box>
            ))}
            </Box>
        </>
    );
}

export default Documents;