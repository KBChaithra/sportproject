/*
By Nicolas Schulz
 */

import React, {Component} from "react";
import HandelTrainer from "../../DB/handelTrainer";
import PostSignup from "../../DB/postSignup";
import logo from '../../loading-gif.gif'
import LoggedHandler from "../../DB/loggedHandler";


const testdata = [
    {
      name: "Hans",
      lastname: "Roth",
      email: "1"
    },
    {
        name: "Dieter",
        lastname: "Roth",
        email: "2"
    },

    {
      name: "Julia",
      lastname: "Kunz",
      email: "3"

    }];

    //progress bar
    const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          console.log(loaded + "bytes of " + total + " bytes | " + percent + "%");
          if (percent < 100) {
            this.setState({ progress: percent });
          } else {
            this.setState({viewprogress: false, progress: 0})
          }
        },
      };



export default class ShareVideo extends Component {

    constructor(props) {
        super(props);
        this.state = {selectedFile:'', title:'',serverFileName:'',uploading:false};
    }

    onFileChange = (event) => {
        // Update the state
        this.setState({ selectedFile: event.target.files[0] });
      };



    sendVideoTitle = (fileName) => {
        if(fileName === '')
            return;
        HandelTrainer.sendVideoTitle({fileName:fileName, title:this.state.title}).then(response => {
            console.log(response.data.res);
            if (response.data.res === "error")
                alert("Es ist ein Fehler aufgetreten.");
            if(response.data.res === "no")
                window.location.href = window.location.origin+"/reg/sign-in?org=$trainer$videoshare";
            if(response.data.res === "ok"){
                if(this.props.uploadDone)
                    this.props.uploadDone();
                else{
                    alert("Hochladen erfolgreich");
                }
            }
        }).catch(e => {
            console.log(e);
            alert("Es ist ein Fehler aufgetreten.");
        });

    }

    handleChange = (event) => {
        event.preventDefault();
        if(event.target.name === "title")
            this.setState({title:event.target.value});
    }



    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.selectedFile === '')
            return;
        const data = new FormData();
        data.append('file', this.state.selectedFile);
        this.setState({uploading:true});
        LoggedHandler.uploadVideo(data).then(response => {
            this.setState({uploading:false});
            console.log(response.data.res);
            if (response.data.res === "error")
                alert("Es ist ein Fehler aufgetreten.");
            if(response.data.res === "no")
                window.location.href = window.location.origin+"/reg/sign-in?org=$trainer$videoshare";
            if(response.data.res === "ok"){
                this.sendVideoTitle(response.data.fileName);
            }
        }).catch(e => {
            this.setState({uploading:false});
            console.log(e);
            alert("Es ist ein Fehler aufgetreten.");
        });
    }



    render() {
          require("./shareVideo.css")
        return (
            <form>
                <h3>Video teilen</h3>

                <div >
                    Hier kannst du ein Video mit deiner Gruppe teilen. Wähle dazu eine Datei aus und drücke anschließend auf "Video hochladen"!
                </div>

                <br></br>

                <div className="form-group">
                    <input
                        type="file"
                        onChange={this.onFileChange}
                    />
          </div>


                <input
                    type="text"
                    className="form-control"
                    name="title"
                    placeholder="Video Title"
                    onChange={this.handleChange}
                />


                <button onClick={this.handleSubmit} className="btn btn-primary btn-block">Video hochladen</button>
                <img width={30} src={logo} alt="loading..." hidden={!this.state.uploading} />
            </form>
        );
    }


}
