import React from "react";
import CustomTable from "../utli/components/CustomTable";
import axios from "axios";
import { CircularProgress } from '@mui/material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import {germanDatePresentation, usDatePresentation} from "../utli/dataConversion";
import PostCSVData from "../DB/postCSV";
import ReactJson from "react-json-view";



const defaultDates = {
  from: new Date(2020, 0, 1),
  to: new Date(2023, 0, 1),
};

// requesting data from API
async function getTests(fromDate, toDate) {
 console.log(
    "https://inprove-sport.info/csvapi/get_slice/" + fromDate + "/" + toDate
  );
  return await axios
    .create({
      baseURL: "https://inprove-sport.info/",
      json: true,
      headers: {
        "Content-type": "application/json",
      },
    })
    .get("/csvapi/get_slice/" + fromDate + "/" + toDate);


}

// utils
const getColLabelsFromData = (data) => {
  let labels = [];
  data.forEach((test) => {

    labels = labels.concat(Object.keys(test["json_record"]));

  });
  // add date to position 1
  labels.splice(1,0,"date");
  return labels;
};

// components
const getFilterFunction = (
  fromDate,
  toDate,
  space,
  gender,
  discipline,
  allSpaces,
  allDisciplines,
  setSpace,
  setDiscipline,
  setFromDate,
  setToDate,
  setGender
) => {
  return (
    <div>
      <button
          className="btn btn-outline-primary btn-block"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "https://inprove-sport.info/csv/downloadCsv";
          }}
      >
        Move to "download subset of data" page
      </button>
      <br/>
      <div style={{ marginTop: "18px", padding: 0 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={3} style={{ width: "33%", display: "inline-block" }}>
            <DesktopDatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
              style={{ width: "240px" }}
              renderInput={(params) => (
                <TextField
                  style={{ width: "240px" }}
                  size="small"
                  {...params}
                />
              )}
            />
          </Stack>
          <Stack spacing={3} style={{ width: "33%", display: "inline-block" }}>
            <DesktopDatePicker
              label="To Date"
              value={toDate}
              onChange={setToDate}
              renderInput={(params) => (
                <TextField
                  style={{ width: "240px" }}
                  size="small"
                  {...params}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
      </div>
      <div style={{ padding: "8px 0" }}>Available disciplines and spaces:</div>
      <div style={{ padding: 0 }}>
        <FormControl
          size="small"
          style={{ width: "33%", display: "inline-block" }}
        >
          <InputLabel id="demo-select-small">Discipline</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={discipline}
            label={"Discipline"}
            onChange={setDiscipline}
            style={{ width: "240px" }}
          >
            <MenuItem value={false}>No selection.</MenuItem>
            {allDisciplines &&
              allDisciplines.map((el, idx) => {
                return (
                  <MenuItem value={el} key={"key-select-discipline-" + idx}>
                    {el}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          style={{ width: "33%", display: "inline-block" }}
        >
          <InputLabel id="demo-select-small">Space</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={space}
            label={"Space"}
            onChange={setSpace}
            style={{ width: "240px" }}
          >
            <MenuItem value={false}>No selection.</MenuItem>
            {allSpaces &&
              allSpaces.map((el, idx) => {
                return (
                  <MenuItem value={el} key={"key-select-" + idx}>
                    {el}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </div>
      <div style={{ padding: "8px 0" }}>Select gender:</div>
      <div style={{ padding: 0 }}>
        <FormControl
          size="small"
          style={{ width: "33%", display: "inline-block" }}
        >
          <InputLabel id="demo-select-small">Gender</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={gender}
            label={"Gender"}
            onChange={setGender}
            style={{ width: "240px" }}
          >
            <MenuItem value={false}>No selection.</MenuItem>
            <MenuItem value={"M"}>Male</MenuItem>
            <MenuItem value={"F"}>Female</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default function TestsView(props) {
  const [filteredTests, setFilteredTests] = React.useState([]);
  const [jsonRecords, setJsonRecords] = React.useState([]);
  const [space, setSpace] = React.useState(false);
  const [discipline, setDiscipline] = React.useState(false);
  const [fromDate, setFromDate] = React.useState(defaultDates["from"]);
  const [toDate, setToDate] = React.useState(defaultDates["to"]);
  const [allDisciplines, setAllDisciplines] = React.useState([]);
  const [allSpaces, setAllSpaces] = React.useState([]);
  const [colLabels, setColLabels] = React.useState([]);
  const [isFirstRender, setIsFirstRender] = React.useState(true);
  const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);
  const [indexArr, setIndexArr] = React.useState([]);
  const [showJson,setShowJson] = React.useState(false);
  const [formatText, setFormatText] = React.useState("Show JSON");
  const [loading, setLoading] = React.useState(false);


  //added for filtering gender
  const [gender, setGender] = React.useState(false);

  // event handlers
  const onApply = () => {
    setJsonRecords([]);
      getTests(
          usDatePresentation(fromDate),
          usDatePresentation(toDate)
    ).then((res) => {

      let testsData = res["data"]["arr"];

      setAllDisciplines(
        Array.from(new Set(testsData.map((el) => el.discipline)))
      );
      setAllSpaces(Array.from(new Set(testsData.map((el) => el.space))));
      // filter the data
      if (discipline) {
        testsData = testsData.filter((el) => el["discipline"] === discipline);
      }
      if (space) {
        testsData = testsData.filter((el) => el["space"] === space);
      }
      //also filter for gender
      if(gender){
        testsData = testsData.filter(el => el['gender'] === gender);
      }
      setFilteredTests(testsData);

      // combined date and json_record for table display
      setJsonRecords(testsData.map((item) => {
        let jsonObj = item.json_record;
        let objEntries = Object.entries(jsonObj);
        let dateStr = item.date;
        let newDateStr = dateStr.split("T")[0];
        objEntries.splice(1,0, ["date", newDateStr]);
        let newJson = Object.fromEntries(objEntries);
        return newJson;

      }));
      //setJsonRecords(testsData.map((t) => t["json_record"]));
      setIndexArr(testsData.map((tt) => tt["id"]));
      setColLabels(getColLabelsFromData(testsData));
      });
  };

  const onReset = () => {
    if (discipline || space) {
      setDiscipline(false);
      setSpace(false);
      setGender(false);
      setFromDate(defaultDates["from"]);
      setToDate(defaultDates["to"]);
        getTests(
        germanDatePresentation(fromDate),
        germanDatePresentation(toDate)
      ).then((res) => {
        let testsData = res["data"]["arr"];

        setAllDisciplines(
          Array.from(new Set(testsData.map((el) => el.discipline)))
        );
        setAllSpaces(Array.from(new Set(testsData.map((el) => el.space))));
        setFilteredTests(testsData);
        setJsonRecords(testsData.map((t) => t["json_record"]));

        setColLabels(getColLabelsFromData(testsData));
        });
    }
  };

  const onDownload = () => {
    var data = jsonRecords;
    var golbalKeys = {};
    for (let i = 0; i < data.length; i++) {
      var arr = Object.keys(data[i]);
      for (let j = 0; j < arr.length; j++) {
        arr[j].replace('"', "");
        arr[j].replace("'", "");
        arr[j] = arr[j].trim();
        golbalKeys[arr[j]] = 1;
      }
    }
    // let csvRows = [Object.keys(data[0])].concat(data);

    let csvRows = [Object.keys(golbalKeys)].concat(data);

    const csvContent = csvRows
      .map((it) => {
        return Object.values(it).toString();
      })
      .join("\n");
    var download = function (content, fileName, mimeType) {
      var a = document.createElement("a");
      mimeType = mimeType || "application/octet-stream";

      if (navigator.msSaveBlob) {
        // IE10
        navigator.msSaveBlob(
          new Blob([content], {
            type: mimeType,
          }),
          fileName
        );
      } else if (URL && "download" in a) {
        a.href = URL.createObjectURL(
          new Blob([content], {
            type: mimeType,
          })
        );
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };

    // execute the download
    download(csvContent, "dowload.csv", "text/csv;encoding:utf-8");
  };

  const onDelete = () => {
    //ask before deletion
    if (selectedRowIndex === null || !jsonRecords) return;
    setSelectedRowIndex(null);
    const id = indexArr[selectedRowIndex];
    PostCSVData.deleteCSVRow({ rowID: id })
      .then((response) => {
        if (response.data.res === "error")
          alert("some error has happened. code dowcsv187");
        if (response.data.res === "no")
          window.location.href =
            window.location.origin + "/reg/sign-in?org=$csv$downloadCsv";
        if (response.data.res === "ok") {
          alert("Row moved to deletion bin..");
          onApply();
        }
      })
      .catch((e) => {
        console.log(e);
        alert("some error has happened..code dowcsv195");
      });
  };

  const onDeleteall = () => {
    //ask before deletion
    setFilteredTests([]);
    setLoading(true);
    let success = 0;
    let promises = [];
    filteredTests.forEach(item => {
      promises.push(
          PostCSVData.deleteCSVRow({ rowID: item.id })
              .then((response) => {
                if (response.data.res === "error")
                  alert("some error has happened. code dowcsv187");
                if (response.data.res === "no")
                  window.location.href =
                      window.location.origin + "/reg/sign-in?org=$csv$downloadCsv";
                if (response.data.res === "ok") {
                  success++;
                }
              })
              .catch((e) => {
                console.log(e);
                alert("some error has happened..code dowcsv195");
              })
      );
    });
    Promise.all(promises)
        .then(() => alert(String(success) + " rows moved to deletion bin.."))
        .then(() => setLoading(false))
        .then(() => onApply());
  };


  const onDatesChange = () => {
    const from = germanDatePresentation(fromDate)
      .split(".")
      .map((el) => parseInt(el));
    const to = germanDatePresentation(toDate)
      .split(".")
      .map((el) => parseInt(el));
    var fetchData = false;
    if (from[2] < to[2]) {
      fetchData = true;
    } else if (from[2] === to[2]) {
      // same year
      if (from[1] < to[1]) {
        fetchData = true;
      } else if (from[1] === to[1]) {
        // same year, same month
        if (from[0] <= to[0]) {
          fetchData = true;
        }
      }
    }
    if (fetchData) {
        getTests(
        germanDatePresentation(fromDate),
        germanDatePresentation(toDate)
      ).then((res) => {
        const testsData = res["data"]["arr"];


        setAllDisciplines(
          Array.from(new Set(testsData.map((el) => el.discipline)))
        );
        setAllSpaces(Array.from(new Set(testsData.map((el) => el.space))));
        // reset if the select option is not available anymore
        if (!allDisciplines.includes(discipline)) {
          setDiscipline(false);
        }
        if (!allSpaces.includes(space)) {
          setSpace(false);
        }
        });
    }
  };

  // data preprocessing
  if (isFirstRender) {
      getTests(
      germanDatePresentation(fromDate),
      germanDatePresentation(toDate)
    ).then((res) => {
      const testsData = res["data"]["arr"];


      setAllDisciplines(
        Array.from(new Set(testsData.map((el) => el.discipline)))
      );
      setAllSpaces(Array.from(new Set(testsData.map((el) => el.space))));
      setIsFirstRender(false);
      });
  }
  let testHeadCells = Array.from(new Set(colLabels));
  testHeadCells = testHeadCells.map((headCell) => {
    return { id: headCell, label: headCell, tableView: true };
  });

  function onRowSelected(index) {
    setSelectedRowIndex(index);
  }

  function switchShowJson(){
    if(!showJson)
      setFormatText("Show Tabular");
    else
      setFormatText("Show JSON");
    setShowJson(!showJson);

  }

  return (
    <>
      <div className="view-header">
        <div>
          {getFilterFunction(
            fromDate,
            toDate,
            space,
            gender,
            discipline,
            allSpaces,
            allDisciplines,
            (event) => setSpace(event.target.value),
            (event) => setDiscipline(event.target.value),
            (event) => {
              setFromDate(event);
              onDatesChange();
            },
            (event) => {
              setToDate(event);
              onDatesChange();
            },
            (event) => setGender(event.target.value)
          )}
          <div style={{ marginBottom: "12px", width: "100%" }}>
            <div style={{ width: "33%", display: "inline-block" }}>
              {
                <Button
                  variant="contained"
                  style={{
                    marginTop: "12px",
                    marginRight: "20px",
                    width: "160px",
                  }}
                  onClick={onApply}
                >
                  Apply
                </Button>
              }
              {
                <Button
                  variant="contained"
                  style={{ marginTop: "12px", width: "160px" }}
                  onClick={onReset}
                  disabled={
                    !discipline &&
                    !space &&
                    fromDate.getTime() === defaultDates["from"].getTime() &&
                    toDate.getTime() === defaultDates["to"].getTime()
                  }
                >
                  Reset
                </Button>
              }
            </div>
            <div style={{ width: "33%", display: "inline-block" }}>
              {
                <Button
                  variant="contained"
                  style={{ marginTop: "12px", width: "120px" }}
                  onClick={onDownload}
                  disabled={filteredTests.length === 0}
                >
                  Download
                </Button>
              }
            </div>

            <div style={{ width: "33%", display: "inline-block" }}>
              {
                <Button
                  variant="contained"
                  style={{ marginTop: "12px", width: "220px" }}
                  onClick={onDelete}
                  disabled={selectedRowIndex === null}
                >
                  Delete selected row
                </Button>
              }
            </div>

            <div style={{ width: "33%", display: "inline-block" }}>
              {
                loading ? (
                              <CircularProgress />
                            ) :
                <Button
                  variant="contained"
                  style={{ marginTop: "12px", width: "160px" }}
                  onClick={() => { if (window.confirm('Are you sure you wish to delete all rows?')) onDeleteall() } }
                  disabled={filteredTests.length === 0}
                >
                  Delete all
                </Button>
              }
            </div>


            <div style={{ width: "33%", display: "inline-block" }}>
              {
                <Button
                    variant="contained"
                    style={{ marginTop: "12px", width: "100px" }}
                    onClick={switchShowJson}
                    disabled={filteredTests.length === 0}
                >
                  {formatText}
                </Button>
              }
            </div>



          </div>
        </div>
      </div>
      <div className="view-content">
        {
          <div>
            <div hidden={!showJson}>
          <ReactJson collapsed={true} src={jsonRecords} />
            </div>
            <div hidden={showJson}>
            <CustomTable
            rows={jsonRecords}
            headCells={testHeadCells}
            title={""}
            hasSpecialRow={false}
            hasChartRepresentation={false}
            dense={true}
            rowsPerPage={10}
            onRowSelected={onRowSelected}
          />
            </div>
          </div>
        }
      </div>
      <div className="view-footer"></div>
    </>
  );
}
