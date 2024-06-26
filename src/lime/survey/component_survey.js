import React, { useState, useRef, useEffect } from 'react';
import Survey from './survey';
import { useParams, useNavigate } from 'react-router-dom';
import PostSignup from '../../DB/postSignup';


// const testdata = [
//     { videoID: 1, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%201.mp4"},
//     { videoID: 2, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%202.mp4"},
//     { videoID: 3, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%203.mp4"},
//     { videoID: 4, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%204.mp4"},
//     { videoID: 5, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%205.mp4"},
//     { videoID: 6, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%206.mp4"},
//     { videoID: 7, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%207.mp4"},
//     { videoID: 8, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%208.mp4"},
//     { videoID: 9, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%209.mp4"},
//     { videoID: 10, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2010.mp4"},
//     { videoID: 11, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2011.mp4"},
//     { videoID: 12, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2012.mp4"},
//     { videoID: 13, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2013.mp4"},
//     { videoID: 14, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2014.mp4"},
//     { videoID: 15, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2015.mp4"},
//     { videoID: 16, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2016.mp4"},
//     { videoID: 17, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2017.mp4"},
//     { videoID: 18, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2018.mp4"},
//     { videoID: 19, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2019.mp4"},
//     { videoID: 20, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2020.mp4"},
//     { videoID: 21, url: "https://inprove-sport.info:8080/videos/dvv/combined/Angriff/Angriff%2021.mp4"},
//     { videoID: 22, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%201.mp4"},
//     { videoID: 23, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%202.mp4"},
//     { videoID: 24, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%203.mp4"},
//     { videoID: 25, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%204.mp4"},
//     { videoID: 26, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%205.mp4"},
//     { videoID: 27, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%206.mp4"},
//     { videoID: 28, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%207.mp4"},
//     { videoID: 29, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%208.mp4"},
//     { videoID: 30, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%209.mp4"},
//     { videoID: 31, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2010.mp4"},
//     { videoID: 32, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2011.mp4"},
//     { videoID: 33, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2012.mp4"},
//     { videoID: 34, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2013.mp4"},
//     { videoID: 35, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2014.mp4"},
//     { videoID: 36, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2015.mp4"},
//     { videoID: 37, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2016.mp4"},
//     { videoID: 38, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2017.mp4"},
//     { videoID: 39, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2018.mp4"},
//     { videoID: 40, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2019.mp4"},
//     { videoID: 41, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2020.mp4"},
//     { videoID: 42, url: "https://inprove-sport.info:8080/videos/dvv/combined/Abwehr/Abwehr%2021.mp4"}
// ]


const testDataLisa = {
    volleyball: [
        { videoID: 1, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff1.mp4"},
        { videoID: 2, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff3.mp4"},
        { videoID: 3, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff14.mp4"},
        { videoID: 4, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff7.mp4"},
        { videoID: 5, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff8.mp4"},
        { videoID: 6, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff9.mp4"},
        { videoID: 7, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff10.mp4"},
        { videoID: 8, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff18.mp4"},
        { videoID: 9, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff15.mp4"},
        { videoID: 10, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff5.mp4"},
        { videoID: 11, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff12.mp4"},
        { videoID: 12, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff6.mp4"},
        { videoID: 13, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff19.mp4"},
        { videoID: 14, url: "https://inprove-sport.info/files/cog/volleyball/showVideos/Angriff13.mp4"}

    ],
    basketball: [

        { videoID: 1, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip8.mp4"},
        { videoID: 2, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip34.mp4"},
        { videoID: 3, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip1.mp4"},
        { videoID: 4, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip5.mp4"},
        { videoID: 5, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip10.mp4"},
        { videoID: 6, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip13.mp4"},
        { videoID: 7, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip25.mp4"},
        { videoID: 8, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip27.mp4"},
        { videoID: 9, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip29.mp4"},
        { videoID: 10, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip31.mp4"},
        { videoID: 11, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip33.mp4"},
        { videoID: 12, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip35.mp4"},
        { videoID: 13, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip38.mp4"},
        { videoID: 14, url: "https://inprove-sport.info/files/cog/basketball/showVideos/Clip40.mp4"}
    ],
    eishockey: [

        { videoID: 1, url: "https://inprove-sport.info/files/cog/showVideos/Aufbau(3).mp4"},
        { videoID: 2, url: "https://inprove-sport.info/files/cog/showVideos/Aufbau(5).mp4"},
        { videoID: 3, url: "https://inprove-sport.info/files/cog/showVideos/ueberzahl(2).mp4"},
        { videoID: 4, url: "https://inprove-sport.info/files/cog/showVideos/Rushverteidigung(1).mp4"},
        { videoID: 5, url: "https://inprove-sport.info/files/cog/showVideos/Aufbau(4).mp4"},
        { videoID: 6, url: "https://inprove-sport.info/files/cog/showVideos/Rush(1).mp4"},
        { videoID: 7, url: "https://inprove-sport.info/files/cog/showVideos/O-Zone(2).mp4"},
        { videoID: 8, url: "https://inprove-sport.info/files/cog/showVideos/Rushverteidigung(2).mp4"},
        { videoID: 9, url: "https://inprove-sport.info/files/cog/showVideos/Rush(2).mp4"},
        { videoID: 10, url: "https://inprove-sport.info/files/cog/showVideos/O-Zone(1).mp4"},
        { videoID: 11, url: "https://inprove-sport.info/files/cog/showVideos/Aufbau(2).mp4"},
        { videoID: 12, url: "https://inprove-sport.info/files/cog/showVideos/Rush(3).mp4"},
        { videoID: 13, url: "https://inprove-sport.info/files/cog/showVideos/ueberzahl(1).mp4"},
        { videoID: 14, url: "https://inprove-sport.info/files/cog/showVideos/Aufbau(1).mp4"}
    ]
};





const Survey_Component = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    // const history = useHistory();
    const { discipline } = useParams();
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    const testData = testDataLisa[discipline] || [];
    const navigate = useNavigate();
    
    return (
            <div>
                <Survey testData={testData} athleteID={id} discipline={discipline}/>
            </div>
        );
    }

export default Survey_Component;

