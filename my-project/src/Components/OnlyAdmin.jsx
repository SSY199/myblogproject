
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function OnlyAdmin() {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser?.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
}
export default OnlyAdmin;
