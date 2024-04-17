import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  const { user, isLoading, showAlert, displayAlert, setupUser } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: 'login',
        alertText: 'Đăng nhập thành công! Đang chuyển hướng...',
      });
    } else {
      setupUser({
        currentUser,
        endPoint: 'register',
        alertText: 'User Created! Redirecting...',
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Đăng nhập Portal' : 'Đăng kí'}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && (
          <FormRow
            type='text'
            name='name'
            labelText='Tên'
            value={values.name}
            handleChange={handleChange}
          />
        )}

        {/* email input */}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />
        {/* password input */}
        <FormRow
          labelText='Mật khẩu'
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />
        <button type='submit' id="login" className='btn btn-block' disabled={isLoading}>
          Đăng nhập
        </button>
        <button
          type='button'
          className='btn btn-block btn-hipster'
          disabled={isLoading}
          onClick={() => {
            setupUser({
              currentUser: { email: 'hoaboy891@gmail.com', password: 'Hoanguyen' },
              endPoint: 'login',
              alertText: 'Đăng nhập thành công! Đang chuyển hướng...',
            });
          }}
        >
          {isLoading ? 'loading...' : 'Người dùng Demo'}
        </button>
        <p>
          {values.isMember ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
          <button type='button' id='register' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Đăng kí' : 'Đăng nhập'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};
export default Register;
