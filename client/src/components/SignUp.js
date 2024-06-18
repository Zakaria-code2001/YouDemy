import React, { useState } from "react";
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import BASEURL from "./config";

const SignUpPage = () => {


    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [show, setShow] = useState(true)
    const [serverResponse,setServerResponse]=useState('')

    const submitForm = (data) => {

        if (data.password === data.confirmPassword) {

            const body = {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password
            }

            const requestOptions = {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(body)
            }

            fetch(`/auth/signup`, requestOptions)
                .then(res => res.json())
                .then(data =>{ 
                    console.log(data)
                    setServerResponse(data.message)
                    console.log(serverResponse)

                    setShow(true)

                })
                .catch(err => console.log(err))
            reset()
        }
        else {
            alert("Passwords do not match")
        }
    }



    return (
        <div className="container">
            <div className="form">
                {show ?
                    <>
                    <Alert variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading></Alert.Heading>
                            <p>
                                {serverResponse}
                            </p>
                        </Alert>
                        <h1>Sign UP page</h1>

                    </>
                    :
                    <h1>Sign UP page</h1>

                }

                <form onSubmit={handleSubmit(submitForm)}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter your First Name"
                                    {...register("first_name", { required: true, maxLength: 80 })}
                                />
                                <br />
                                {errors.first_name && <span style={{ color: "red" }}><small>First Name is required</small></span>}
                                {errors.first_name?.type === "maxLength" && <p style={{ color: "red" }}><small>Max characters should be 80</small></p>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter your Last Name"
                                    {...register("last_name", { required: true, maxLength: 80 })}
                                />
                                <br />
                                {errors.last_name && <span style={{ color: "red" }}><small>Last Name is required</small></span>}
                                {errors.last_name?.type === "maxLength" && <p style={{ color: "red" }}><small>Max characters should be 80</small></p>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email"
                            {...register("email", { required: true, maxLength: 320 })}
                        />
                        <br></br>
                        {errors.email && <p style={{ color: "red" }}><small>Email is required</small></p>}

                        {errors.email?.type === "maxLength" && <p style={{ color: "red" }}><small>Max characters should be 80</small></p>}
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your Password"
                            {...register("password", { required: true, minLength: 8 })}
                        />
                        <br></br>
                        {errors.password && <p style={{ color: "red" }}><small>Password is required</small></p>}
                        <br></br>
                        {errors.password?.type === "minLength" && <p style={{ color: "red" }}><small>Min characters should p</small></p>}
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter your Password"
                            {...register("confirmPassword", { required: true, minLength: 8 })}
                        />
                        <br></br>
                        {errors.confirmPassword && <p style={{ color: "red" }}><small>Confirm Password is required</small></p>}
                        <br></br>
                        {errors.confirmPassword?.type === "minLength" && <p style={{ color: "red" }}><small>Min characters should be 80</small></p>}
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Button variant="primary" type="submit" onClick={handleSubmit(submitForm)}>SignUp</Button>
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <small>Already have an account, <Link to="/login">Log In</Link></small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}
export default SignUpPage