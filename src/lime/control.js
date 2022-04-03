import React, { Component } from "react";
import './style.css';
export default class Login extends Component {
    render() {
        return (
            <form>
                <h3>LimeSurvey: Participant Control Panel</h3>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                </div>


                <div className="form-group">
                    <label>Survey ID</label>
                    <input type="number" className="form-control" placeholder="Enter Survey number" />
                </div>

                <div>
                    <button>Add participants</button>
                    <button>delete participants</button>
                </div>
                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}