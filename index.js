const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

//Function to parse JSON file
function parsingFunction (datafile) {
    const file = require('./' + datafile);
    return file;
}

const courseData = parsingFunction('Lab3-timetable-data.json'); 
// Array of schedule objects
const scheduleNamesArray = [];

// Setup serving front-end code
app.use(express.static(process.cwd() + '/angular-frontend/dist/angular-frontend'));

// Setup middleware to do logging
app.use((req, res, next) => { // for all routes
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');
    res.header('Access-Control-Allow-Methods', '*');
    console.log(`${req.method} request for ${req.url}`);
    next(); // keep going
});

// Route for root 
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/angular-frontend/dist/angular-frontend/index.html'); 
});

// Route to GET subject codes and descriptions -- #1
app.get('/api/courses', (req, res) => {
    const subjects = []; 
    for(i = 0; i < courseData.length; i++) {
         subjects.push({
             "subject": courseData[i].subject,
             "className": courseData[i].className
            });
    }
    res.send(subjects);
});

// Route to GET all course codes for a given subject code -- #2
app.get('/api/courses/subjects/:subject', (req, res) => {
    const courseCode = [];
    for(i = 0; i < courseData.length; i++) {
        if (String(courseData[i].subject).includes(`${req.params.subject}`) && String(req.params.subject).length <= 15) {
            courseCode.push({
                "subject": courseData[i].subject,
                "className": courseData[i].className,
                "catalog_nbr": courseData[i].catalog_nbr,
                "course_info": courseData[i].course_info,
                "description": courseData[i].catalog_description
            });
        }
    }
    if (courseCode.length > 0) {
        res.send(courseCode);
    }
    // 404 subject code doesn't exist
    else {
        res.status(404).send('The courses with the given subject code were not found.');
    }
});

// Route to GET timetable entry with subject, course, and component  -- #3
app.get('/api/courses/subjects/:subject/:catalog_nbr/:ssr_component', (req, res) => {
    const ttEntry = [];
    for(i = 0; i < courseData.length; i++) {
        if (String(courseData[i].subject).includes(`${req.params.subject}`) 
            && String(courseData[i].catalog_nbr).includes(`${req.params.catalog_nbr}`)
            && String(courseData[i].course_info[0].ssr_component).includes(`${req.params.ssr_component}`)) {
            ttEntry.push(courseData[i]);
        }
    }
    if (ttEntry.length > 0) {
        res.send(ttEntry);
    }
    // 404 subject code doesn't exist
    else {
        res.status(404).send('The timetable entry was not found');
    }
});

// Route to GET timetable entry with subject and course -- #3
app.get('/api/courses/subjects/:subject/:catalog_nbr', (req, res) => {
    const ttEntry = [];
    for(i = 0; i < courseData.length; i++) {
        if (String(courseData[i].subject).includes(`${req.params.subject}`)
            && String(courseData[i].catalog_nbr).includes(`${req.params.catalog_nbr}`)) {
            ttEntry.push(courseData[i]);
        }
    }
    if (ttEntry.length > 0) {
        res.send(ttEntry);
    }
    // 404 subject code doesn't exist
    else {
        res.status(404).send('The timetable entry was not found');
    }
});

// Route to create new schedule with given schedule name using POST -- #4
app.post('/api/courses/schedules', (req, res) => {
    const NewName = req.body.scheduleName;
    const schedName = scheduleNamesArray.find(p => p.scheduleName === NewName);
    if(schedName) {
    res.status(400).send('Schedule name already exists');
    }
    else if(!schedName && String(NewName).length < 20) {
    scheduleNamesArray.push({
        "scheduleName": String(NewName),
        "codePairsList": []
    });
    res.send(scheduleNamesArray);
    }
});

// Route to save a list of subject code, course code pairs under schedule name -- #5
app.put('/api/courses/schedules/:name', (req, res) => {
    const name = req.params.name;
    const schedName = scheduleNamesArray.find(p => p.scheduleName === name);
    if(!schedName) {
        res.status(404).send('Schedule name does not exist');
    }
    else if(schedName && String(name).length < 20) {
        schedName.codePairsList = req.body;
        for(i = 0; i < schedName.codePairsList.length; i++){
            for(j = 0; j < courseData.length; j++){
                if (String(courseData[j].subject).includes(`${schedName.codePairsList[i].subject}`)
                && String(courseData[j].catalog_nbr).includes(`${schedName.codePairsList[i].catalog_nbr}`)) {
                    schedName.codePairsList[i].className = courseData[j].className;
                    schedName.codePairsList[i].course_info = courseData[j].course_info;
                    schedName.codePairsList[i].description = courseData[j].catalog_description;
                }
            }
        }
        res.send(schedName);
    }
});

// Route to GET list of subject code, course code pairs for given schedule -- #6
app.get('/api/courses/schedules/:name', (req, res) => {
    const name = req.params.name;
    const schedName = scheduleNamesArray.find(p => p.scheduleName === name);
    if(!schedName) {
        res.status(404).send('Schedule name does not exist');
    }
    else if(schedName && String(name).length < 20) {
        res.send(schedName.codePairsList);
    }
});

// Route to DELETE a schedule with a given name -- #7
app.delete('/api/courses/schedules/:name', (req, res) => {
    const name = req.params.name;
    const schedName = scheduleNamesArray.find(p => p.scheduleName === name);
    if(!schedName)
    {
        res.status(404).send('Schedule name does not exist');
    }
    else{
        const index = scheduleNamesArray.indexOf(schedName);
        scheduleNamesArray.splice(index, 1)
        res.send(scheduleNamesArray);
    }
});

// Route to GET a list of schedule names with the number of courses that are saved -- #8
app.get('/api/courses/schedules', (req, res) => {
    const NamesOfSchedules = [];
    for (i = 0; i < scheduleNamesArray.length; i++) {
        NamesOfSchedules.push({
            "scheduleName": scheduleNamesArray[i].scheduleName,
            "numberOfCourses": scheduleNamesArray[i].codePairsList.length
        });
    }
    res.send(NamesOfSchedules);
});

// Route to DELETE all schedules -- #9
app.delete('/api/courses/schedules', (req, res) => {
    scheduleNamesArray.splice(0, scheduleNamesArray.length);
    res.send(scheduleNamesArray);
});

// PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});