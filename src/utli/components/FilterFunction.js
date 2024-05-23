import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React from 'react';

export default function FilterFunction(props) {
    const {athletes, titles, initialEvaluations, updateEvaluations} = props;

    // STATE
    const [selectedAthlete, setSelectedAthlete] = React.useState(false);
    const [selectedTitle, setSelectedTitle] = React.useState(false);
    const [planned, setPlanned] = React.useState('');
    const [achieved, setAchieved] = React.useState('');
    const [difference, setDifference] = React.useState('');
    const [searchText, setSearchText] = React.useState("");
    const [filteredeva, setFilteredeva] = React.useState([]);

    const filterNotSet = !selectedAthlete && !selectedTitle && !planned && !achieved && !difference && !searchText;
    // EVENT HANDLERS
    const apply = () => {
        if(filterNotSet) {
            return;
        }
        let filteredData = initialEvaluations;
        if (searchText) {
            filteredData = filteredData.filter(el => (el.name + el.title + el.comments).includes(searchText));
        }
        if (selectedAthlete) {
            filteredData = filteredData.filter(el => el.name === selectedAthlete);
        }
        if (selectedTitle) {
            filteredData = filteredData.filter(el => el.title === selectedTitle);
        }
        if (planned) {
            filteredData = filteredData.filter(el => el.planned === planned);
        }
        if (achieved) {
            filteredData = filteredData.filter(el => el.achieved === achieved);
        }
        if (difference) {
            filteredData = filteredData.filter(el => el.difference === difference);
        }
        setFilteredeva(filteredData);
        updateEvaluations(filteredData);
    }

    const reset = () => {
        setSelectedAthlete(false);
        setSelectedTitle(false);
        setPlanned('');
        setAchieved('');
        setDifference('');
        updateEvaluations(initialEvaluations);
    }

    const downloadCoach = (event) => {
        if(filteredeva.length === 0){
            var initcsv = convertToCsv(initialEvaluations);
            download(initcsv, "history.csv", "text/csv");
        }else{
            var filtercsv = convertToCsv(filteredeva);
            download(filtercsv, "history.csv", "text/csv");
        }
    }

    function convertToCsv(arr){
        const keys = Object.keys(arr[0]);
        const replacer = (_key, value) => value === null ? '' : value;
        const processRow = row => keys.map(key => JSON.stringify(row[key], replacer)).join(',');
        return [ keys.join(','), ...arr.map(processRow) ].join('\r\n');
    };

    const download = (content, fileName, contentType) => {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    // COMPONENTS
    const numberInput = () => {
        return (
            <div style={{
                marginTop: '18px',
                width:'340px',
                padding: 0,
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div className="number-input-container">
                    <TextField
                        type="number"
                        size="small"
                        name="Difference"
                        label="Differenz"
                        variant="filled"
                        value={difference}
                        onChange={event => setDifference(event.target.value)}/>
                </div>
                <div className="number-input-container">
                    <TextField
                        type="number"
                        size="small"
                        name="Achieved"
                        label="Erreicht"
                        variant="filled"
                        value={achieved}
                        onChange={event => setAchieved(event.target.value)}/>
                </div>
                <div className="number-input-container">
                    <TextField
                        type="number"
                        size="small"
                        name="Planned"
                        label="Geplant"
                        variant="filled"
                        value={planned}
                        onChange={event  => setPlanned(event.target.value)}/>
                </div>
            </div>
        );
    }

    const selectComponent = (label, value, elements, onChange) => (
        <div style={{marginTop: '18px', padding: 0, display: 'inline-block', marginRight: '12px'}}>
            <FormControl size="small" style={{display: 'inline-block'}}>
                <InputLabel id="demo-select-small">{label}</InputLabel>
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={value}
                    label={label}
                    style={{width: '340px'}}
                    onChange={onChange}
                >
                    <MenuItem value={false}>Nichts ausgewählt.</MenuItem>
                    {elements && elements.map((el, idx) => {
                        return <MenuItem value={el} key={'key-select-' + idx}>{el}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </div>
    );


    return (
        <div>
            <div className="filter-function-wrapper">
                <div>
                    <TextField style={{width: '340px'}} id="search-general" label="Suchen" variant="standard" onChange={event => setSearchText(event.target.value)}/>
                    <br/>
                    {selectComponent('Athlet*innen', selectedAthlete, athletes, (event) => {setSelectedAthlete(event.target.value)})}
                    {selectComponent('Titel', selectedTitle, titles, (event) => {setSelectedTitle(event.target.value)})}
                    {numberInput()}
                </div>
                <div style={{marginBottom: '12px'}}>
                    <Button
                        variant="contained"
                        style={{marginTop: '12px', width: '170px'}}
                        onClick={apply}
                    >
                        Anwenden
                    </Button>
                    <Button
                        variant="contained"
                        style={{marginTop: '12px', marginLeft: '12px', width: '160px'}}
                        onClick={reset}
                        disabled={filterNotSet}
                    >
                        Zurücksetzen
                    </Button>
                    <Button
                        variant="contained"
                        style={{marginTop: '12px', marginLeft: '12px', width: '160px'}}
                        onClick={downloadCoach}
                    >
                        Herunterladen
                    </Button>
                </div>
            </div>
        </div>
    )
}