    import '../styles/login.css';
    import React, { useState, useEffect } from 'react';
    import TemplateLogin from '../template/TemplateLogin';
    import { Link, useNavigate } from 'react-router-dom';
    import axios from 'axios';
    import { toast } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { FaLongArrowAltLeft } from 'react-icons/fa';

    function Login() {
        const [username, setUserName] = useState('');
        const [password, setPassword] = useState('');
        const [rememberMe, setRememberMe] = useState(false);
        const navigate = useNavigate();

        // Redirect if already authenticated
        useEffect(() => {
            const token = sessionStorage.getItem('token');
            if (token) {
                navigate('/error');
            }
        }, [navigate]);

        // Load saved credentials if "Remember Me" is enabled
        useEffect(() => {
            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');
            if (storedUsername && storedPassword) {
                setUserName(storedUsername);
                setPassword(storedPassword);
                setRememberMe(true);
            }
        }, []);

        // Validate login form inputs
        const IsValidate = () => {
            let isProceed = true;
            if (!username) {
                isProceed = false;
                toast.error('Please enter username');
            }
            if (!password) {
                isProceed = false;
                toast.error('Please enter password');
            }
            return isProceed;
        };

        // Handle login request and navigate based on role
        async function handleLogin(event) {
            event.preventDefault();
            if (IsValidate()) {
                try {
                    const response = await axios.post(
                        'http://localhost:8080/api/auth/login',
                        { username, password }
                    );

                    if (response.status === 200) {
                        sessionStorage.setItem('token', response.data.token);

                        if (rememberMe) {
                            localStorage.setItem('username', username);
                            localStorage.setItem('password', password);
                        } else {
                            localStorage.removeItem('username');
                            localStorage.removeItem('password');
                        }

                        // Debug: Log targetPage from response
                        console.log("targetPage from backend:", response.data.targetPage);

                        // Get response data from backend to get target Page navigation
                        let targetPage = response.data.targetPage || '/';
                        if (targetPage === '/dashboard') {
                            targetPage = '/';  // Thay thế '/new-path' bằng đường dẫn bạn muốn
                        }
                        navigate(targetPage);
                        toast.success('Login Success');
                    } else {
                        throw new Error(`Unexpected status code ${response.status}`);
                    }
                } catch (error) {
                    toast.error('Invalid Username or Password');
                }
            }
        }


        const homePage = () => {
            navigate('/');
        };

        return (
            <TemplateLogin>
                <h3 type="button" onClick={homePage} style={{ marginTop: '20px' }}>
                    <FaLongArrowAltLeft /> &ensp;&ensp;HomePage
                </h3>
                <div className="container" style={{ marginTop: '100px' }}>
                    <div className="row px-3">
                        <div className="col-lg-10 col-xl-9 card flex-row mx-auto px-0">
                            <div className="card-body">
                                <h4 className="title text-center mt-4">Login into account</h4>
                                <form className="form-box px-3" onSubmit={handleLogin}>
                                    <div className="form-input" style={{ borderStyle: 'none' }}>
                                        <span>
                                            <i className="fa fa-envelope-o" />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            required
                                            value={username}
                                            onChange={(event) => setUserName(event.target.value)}
                                        />
                                    </div>
                                    <div className="form-input" style={{ borderStyle: 'none' }}>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="custom-control custom-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="cb1"
                                                checked={rememberMe}
                                                onChange={(event) => setRememberMe(event.target.checked)}
                                            />
                                            <label className="custom-control-label" htmlFor="cb1">
                                                Remember Me
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                        >
                                            Login
                                        </button>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="text-center mb-2">
                                        <Link to="/forgotpass">Forgot Password</Link>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="text-center mb-2">
                                        Do not have an account?
                                        <Link to="/register">Register here</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </TemplateLogin>
        );
    }

    export default Login;
