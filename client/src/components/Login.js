import React from "react";
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { login } from "../auth";
import { useHistory } from 'react-router-dom'
import BASEURL from "./config";


const LoginPage = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const history = useHistory()

    const loginUser = (data) => {

        console.log(data)

        const requestOptions = {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        // Use BASEURL constant in fetch request
        fetch(`/auth/login`, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data.access_token)
                login(data.access_token)

                history.push('/')
            })

        reset()
    }
    return (
        <div className="container">
            <div className="form">
                <h1>Login page</h1>
                <form>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter your Email"
                            {...register('email', { required: true, maxLength: 80 })}
                        />
                    </Form.Group>
                    {errors.email && <p style={{ color: 'red' }}><small>Email is required</small> </p>}
                    {errors.email?.type === "maxLength" && <p style={{ color: 'red' }}> <small> email should be like "exemple@gmail.com"</small></p>}
                    <br></br>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your Password"
                            {...register('password', { required: true, minLength: 8 })}
                        />
                    </Form.Group>
                    {errors.password && <p style={{ color: 'red' }}><small>Password is required</small> </p>}
                    {errors.password?.type === "maxLength" && <p style={{ color: 'red' }}>
                        <small> Password should be more than 8 characters</small></p>}
                    <br></br>

                    <Form.Group>
                    <Button
                        as="sub"
                        variant="primary"
                        onClick={handleSubmit(loginUser)}
                        style={{ padding: '10px 20px', fontSize: '12px' }}>Login</Button>
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <small>Do not have an account? <Link to="/signup">Create One</Link></small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}
export default LoginPage
