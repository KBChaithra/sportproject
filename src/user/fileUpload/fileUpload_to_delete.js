/*
By Ahmed Al-Ghezi
 */

import React, {Component} from "react";

import '../../register/style.css';
import PostSignup from '../../DB/postSignup';
import {useNavigate} from 'react-router-dom';
import AlertDialog from "../../utli/alertDialog";
import SignUp from "../../register/SignUp";
import {processArr} from "../../csvHandler/processCSV";
import Sheet from "../../csvHandler/xlsSheet/XlsSheet";
import {Alert} from "@mui/material";
import axios from "axios";
import PostCSVData from "../../DB/postCSV";

class UploadFileC extends Component {


    constructor(props) {
        super(props);
        this.state = {
            success:false, error:false, file:null };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    componentDidMount() {
        this.setState({ID:179});
    }

    handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        if (name === "readTerms")
            value = target.checked;
        this.setState({
            [name]: value
        });
    }





    checkInput(stateData){
        if(stateData.file === null){
            alert("please select a file");
            return false;
        }
        return true;
    }

    saveFileName = (fileName) => {
        PostCSVData.saveFileNameToAthlete({fileName:fileName,ID:179,title:this.state.title}).then(response => {
            console.log(response.data.res);
            if (response.data.res === "error")
                alert("some error has happened");
            if(response.data.res === "no")
                window.location.href = window.location.origin+"/reg/sign-in?org=$reg$uploadConsent";
            if(response.data.res === "ok"){
                alert("File uploaded successfully");
            }
            if(response.data.res == "wrong email"){
                alert("Error, server could not send notification email..Is the athlete email correct?");
            }
        }).catch(e => {
            console.log(e);
            alert("some error has happened...code 70");
        });
    }

    handleSubmit(event) {
        event.preventDefault();
         if(!this.checkInput(this.state))
             return;
        const data = new FormData();
        data.append('file', this.state.file);

        PostCSVData.uploadToAthlete(data).then(response => {
            console.log(response.data.res);
            if (response.data.res === "error")
                alert("some error has happened. code 84");
            if(response.data.res === "no")
                window.location.href = window.location.origin+"/reg/sign-in?org=$reg$uploadConsent";
            if(response.data.res === "ok"){
                this.saveFileName(response.data.filename);
            }
        }).catch(e => {
            console.log(e);
            alert("some error has happened..code 92");
        });
    }


    handleFileUpload = (event) =>{
        event.preventDefault();
        console.log(event.target.files[0]);
        this.setState({file:event.target.files[0]});

    }




    render() {
        return(

            <div>
                <h3>Dateien hochladen</h3>
                <form id='uploadConsent' onSubmit={this.handleSubmit}>
                    <br/>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Dateititel.."
                            name="title"
                            onChange={this.handleChange}
                        />
                    </div>
                    <input type="file"  accept=".pdf,.png,.jpg,.jpeg,.gif" onChange={this.handleFileUpload}/>
<br/><br/>
                    <button type={"submit"}  className="btn btn-primary btn-block">submit</button>
                    <Alert severity="success" hidden={!this.state.success}>{this.state.successMsg}</Alert>
                    <Alert severity="error" hidden={!this.state.error}>{this.state.errorMsg}</Alert>

                </form>

            </div>
        );

    }



}




function UploadFile(props) {
    let navigate = useNavigate();
    return <UploadFileC {...props} navigate={navigate}/>
}

export default UploadFile;



