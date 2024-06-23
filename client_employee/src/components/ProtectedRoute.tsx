import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectIsLoggedIn } from '../store/userSlice';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    return isLoggedIn ? element : <Navigate to='/login' replace />;
}

export default ProtectedRoute;