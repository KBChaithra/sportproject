/*
By Ahmed Al-Ghezi
 */

import React, {Component, useState} from "react";
import PostSignup from "../DB/postSignup";
import {useNavigate, useSearchParams} from "react-router-dom";
import AcceptTerms from "./acceptTerms";
import ApproveTests from "./approveTests";
import ApproveTestsCNew from "./approveTests";

 class EmailConfirmedC extends Component {


    constructor(props) {
        super(props);
        this.state = {
            readTerms: false,
            showParentAccept:false,
            emailConfirmationCode:'',
            showConfirmedEmail:false,
            showAcceptTerms:false,
            showNextButton:false,
            under18:false
        };
    }

    componentDidMount() {
        if(this.props.emailConfirmCode) {
            this.setState({showConfirmedEmail: true});
        }
        this.hasAcceptTerms();
    }

    handleSubmit = (event) => {
        if(event)
            event.preventDefault();
        window.location.href = window.location.origin+"/reg/profile";
    }

    handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        if (name === "readTerms") value = target.checked;
        if (name === "parentAccept") value = target.checked;
        this.setState({
            [name]: value,
        });
    }

     onSendAcceptTerms = () =>{
         this.props.done(true);
     }

     hasAcceptTerms = () =>{
        PostSignup.hasAcceptTerms({emailConfirmCode: this.props.emailConfirmCode}).then((response)=>{
            if(response.data.res == "ok" && !response.data.accept){
                if(response.data.consent_required){
                    this.setState({under18:true});
                    this.props.setUnder18(true);
                }
                //for now we just skip the approve studies part for the alerady registered people
                //this.setState({showAcceptTerms:true});
                //this.setState({showNextButton:false});
                this.onSendAcceptTerms()
            }else
                this.setState({showNextButton:true});
        }).catch((e) => {
            console.log(e);
            alert("Es ist ein Fehler aufgetreten.");
        });
     }


    render() {
        return (
            <div>
                <div>
                    <h3> Vielen Dank für die Bestätigung Deiner E-Mail
                    </h3>
                </div>


                <div hidden={!this.state.showAcceptTerms}>
                    <ApproveTests  emailConfirmationCode={this.props.emailConfirmCode} onSent={this.onSendAcceptTerms}  email={""} discipline={""}/>
                </div>


                <button type="submit" onClick={this.handleSubmit} hidden={!this.state.showNextButton} className="btn btn-primary btn-block">
                    Weiter
                </button>
            </div>
        );
    }

}


function EmailConfirmed(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showAcceptTerms, setShowAcceptTerms] = useState(false);
    const [under18, setUnder18] = useState(false);

    const emailConfirmCode = searchParams.get("emailConfirmCode");

    return(
    <div>
        <div hidden={showAcceptTerms}>
            <EmailConfirmedC {...props}   done = {setShowAcceptTerms} emailConfirmCode={emailConfirmCode} setUnder18={setUnder18}/>
        </div>
        <div hidden={!showAcceptTerms}>
            <AcceptTerms  emailConfirmCode = {emailConfirmCode} under18={under18} />
        </div>
    </div>);

    /*<div>


        <AcceptTerms  hidden={!this.state.showAcceptTerms} hideSubmit={true}/>
    </div>*/
}

export default EmailConfirmed;