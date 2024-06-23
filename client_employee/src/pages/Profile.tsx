function Profile() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <>
            <div>Profile Page</div>
            <button onClick={handleLogout}>Log Out</button>
        </>
    );
}

export default Profile;