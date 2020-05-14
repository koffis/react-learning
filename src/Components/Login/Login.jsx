import React from "react";
import {Field, reduxForm} from "redux-form";
import {Input} from "../common/FormControls/FormControls";
import {required} from "../../Utils/Validators/validator";
import {connect} from "react-redux";
import {login} from "../../Redux/auth-reducer";
import {Redirect} from "react-router";
import s from '../common/FormControls/FormControl.module.css'



const LoginForm = (props) => {
    return (
        <div>
            <form onSubmit={props.handleSubmit}>
                <div>
                    <Field placeholder={'Email'} name={'email'}
                           validate={[required]}
                           component={Input}/>
                </div>
                <div>
                    <Field placeholder={'Password'}
                           type={'password'}
                           validate={[required]}
                           name={'password'} component={Input}/>
                </div>
                <div>
                    <Field component={Input} name={'rememberMe'} type={'checkbox'}/> Remember me
                </div>
                {props.error && <div className={s.form_summary_error}>
                    {props.error}
                </div>}
                <div>
                    <button>Login</button>
                </div>
            </form>
        </div>
    )
};

const LoginReduxForm = reduxForm({form:'login'})(LoginForm);

const Login = (props) => {
    const onSubmit = (formData) => {
        props.login(formData.email, formData.password, formData.rememberMe)
    };

    if(props.isAuth) {
        return <Redirect to={'/profile'}/>
    }
    return (
        <div>
            <h1>Login</h1>
            <LoginReduxForm onSubmit={onSubmit}/>
        </div>
    )
};

const mapStateToProps = (state) =>({
    isAuth:state.auth.isAuth
});

export default connect(mapStateToProps, {login})(Login);