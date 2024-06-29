import { Box, Button } from "@mui/material";

type EditButtonProps = {
    editMode: boolean;
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
    toggleEditMode: () => void;
};

const EditButton: React.FC<EditButtonProps> = ({ editMode, saveChanges, cancelChanges, toggleEditMode }) => {
    return (
        <>
            {editMode ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '8rems' }}>
                    <Button onClick={saveChanges}>Save</Button>
                    <Button onClick={cancelChanges} sx={{ color: 'red', borderColor: 'red'}}>Cancel</Button>
                </Box>
            ) : (
                <Button onClick={toggleEditMode}>Edit</Button>
            )}
        </>
    );
}

export default EditButton;