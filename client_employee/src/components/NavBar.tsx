import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Box, Button } from "@mui/material";

function NavBar() {
    return (
        <AppBar position="static" elevation={0} sx={{ background:'#9EAABA', fontSize:'1.5rem'}}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button component={ RouterLink } to='/profile' sx={{color: 'black'}}>
                        Home
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button component={ RouterLink } to='/profile' sx={{color: 'black'}}>
                        Profile
                    </Button>

                    <span style={{ margin: '1rem', color: 'black' }}>|</span>

                    <Button component={ RouterLink } to='/visa' sx={{color: 'black'}}>
                        Visa Status Management
                    </Button>

                    <span style={{ margin: '1rem', color: 'black' }}>|</span>

                    <Button component={ RouterLink } to='/housing' sx={{color: 'black'}}>
                        Housing
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;