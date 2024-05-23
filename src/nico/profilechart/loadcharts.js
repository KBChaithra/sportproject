/*
By Nicolas Schulz
 */

import React, {Component} from "react";
import handelTrainer from "../../DB/handelTrainer";
import ProfileChart from "./profilechart";
import { Grid } from "@mui/material";
import PostCSVData from "../../DB/postCSV";


const charts = [
    {data: [
            {value: 27.5, label: "Sprunghöhe - 09.21"},
            {value: 29.9, label: "Sprunghöhe - 06.22"},
            {value: 27.5, label: "Sprunghöhe - 09.23"},
            {value: 29.9, label: "Sprunghöhe - 06.24"},
        ], refer: [{value: 0, label: ""}, {value: 40, label: "Referenzwert(cm)"}],
        titel: "Profile Chart 2" },
    {data: [
            {value: 27.5, label: "Sprunghöhe - 09.21"},
            {value: 29.9, label: "Sprunghöhe - 06.22"},
        ], refer: [{value: 0, label: ""}, {value: 40, label: "Referenzwert(cm)"}],
        titel: "Profile Chart 2" },
    {data: [
            {value: 27.5, label: "Sprunghöhe - 09.21"},
            {value: 29.9, label: "Sprunghöhe - 06.22"},
        ], refer: [{value: 0, label: ""}, {value: 40, label: "Referenzwert(cm)"}],
        titel: "Profile Chart 2" }
];

export default class LoadCharts extends Component {

    constructor(props) {
        super(props);
        this.state = {charts: []};
        this.getAll = this.getAll.bind(this);
    }


    componentDidMount() {
        this.getAll();
    }
    getAll(){
        //need to add empty object for space
        //this.setState({ref: ref, arrtest: testdata, title: titel });
        PostCSVData.getCharts().then(response => {
            if(response.data.res === "error") {
                const arr = ["connection error"];
                return;
            }
            if(response.data.res === "no"){
                alert("Bitte erst anmelden.");
                return;
            }
            if(response.data.res === "ok") {
                this.setState({charts: response.data.charts})
            }

        }).catch(e => {
            console.log(e);
            alert("Es ist ein Fehler aufgetreten!");
        });
    }






    render() {
        //require("./uploadFile.css")

        return (
            <div>
                <h3>Stat page</h3>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {this.state.charts.map(function(d, idx){
                        return (<Grid item xs={6}><div style= {{...{height: '350px'}}}><ProfileChart arrtest={d.data} refer={d.refer} title={d.titel}/></div></Grid>)
                    })}
                </Grid>
            </div>
        );
    }
}