const express = require('express');
const app = express();
app.use(express.json());

var stringSimilarity = require('string-similarity');

//PORT 
const port = process.env.PORT || 3000;

var admin = require('firebase-admin');
var defaultApp = admin.initializeApp();
var defaultAuth = defaultApp.auth();

console.log(defaultApp.name); // '[DEFAULT]'

//Function to parse JSON file
function parsingFunction (datafile) {
    const file = require('./' + datafile);
    return file;
}

const courseData = parsingFunction('Lab3-timetable-data.json'); 

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
app.get('/api/open/courses', (req, res) => {
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
app.get('/api/open/courses/subjects/:subject', (req, res) => {
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
app.get('/api/open/courses/subjects/:subject/:catalog_nbr/:ssr_component', (req, res) => {
    const ttEntry = [];
    for(i = 0; i < courseData.length; i++) {
        if (String(courseData[i].subject).includes(`${req.params.subject}`) 
            && String(courseData[i].catalog_nbr).includes(`${req.params.catalog_nbr}`)
            && String(courseData[i].course_info[0].ssr_component).includes(`${req.params.ssr_component}`))
        {
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

// Route to GET timetable entry with course and component
app.get('/api/open/courses/subjects/numberAndComponent/:catalog_nbr', (req, res) => {
    const ttEntry = [];
    for(i = 0; i < courseData.length; i++) {
        if (String(courseData[i].catalog_nbr).includes(`${req.params.catalog_nbr}`)) 
        {
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

app.get('/api/open/courses/subjects/keywords/:keyword', (req, res) => {
    const ttEntry = [];
    for(i = 0; i < courseData.length; i++) {
        if (stringSimilarity.compareTwoStrings(`${req.params.keyword}`, String(courseData[i].className)) >= 0.3
            || stringSimilarity.compareTwoStrings(`${req.params.keyword}`, String(courseData[i].catalog_nbr)) >= 0.3) 
        {
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
app.get('/api/open/courses/subjects/:subject/:catalog_nbr', (req, res) => {
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

// Array of schedule objects
const scheduleNamesArray = [];

// Array of users
const userNames = [];

app.post('/api/secure/users', (req, res) => {
    authHeader = req.header('Authorization');

    if(authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken);
            
            const NewUser = req.body.userName;
            const UserEmail = req.body.email;
            const userName = userNames.find(p => p.userName === NewUser);
            if(userName) {
            res.status(400).send('Username already exists');
            res.send("Username already exists");
            }
            else if(!userName && String(NewUser).length < 10) {
            const temp = [];

            userNames.push({
                "userName": String(NewUser),
                "email": String(UserEmail),
                "scheduleNamesArray": []
            });

            for(i = 0; i < userNames.length; i++)
            {
                temp[i] = userNames[i].userName;
            }    

            res.send(temp);
            }

        }).catch((error) => {
            console.log(error);
        });
    }
});

// Route to create new schedule with given schedule name using POST -- #4
app.post('/api/secure/courses/users/:userEmail/schedules', (req, res) => {
    authHeader = req.header('Authorization');

    if(authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken);

            const NewName = req.body.scheduleName;
            const schedName = false;
            const result = [];

            for(i = 0; i < userNames.length; i++)
            {
                if(userNames[i].email == req.params.userEmail)
                {
                    for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                    {
                        if(userNames[i].scheduleNamesArray[j].scheduleName == NewName)
                        {
                            schedName = true;
                        }
                    }
                }
            }

            if(schedName == true) {
            res.status(400).send('Schedule name already exists');
            }
            else if((schedName == false) && String(NewName).length < 20) {
                for(i = 0; i < userNames.length; i++)
                {
                    if(userNames[i].email == req.params.userEmail)
                    {
                        userNames[i].scheduleNamesArray.push({"scheduleName": String(NewName), "codePairsList": [], "description": NewDescription, "visibility":  NewVisibility});
                        result = userNames[i].scheduleNamesArray;
                    }
                }

                res.send(result);
            }

        }).catch((error) => {
            console.log(error);
        });
    }
});

// Route to save a list of subject code, course code pairs under schedule name -- #5
app.put('/api/secure/courses/users/:userEmail/schedules/:name', (req, res) => {
    
    authHeader = req.header('Authorization');

    if(authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken);
            
            const name = req.params.name;
            const newName = req.body.newName;
            const NewDescription = req.body.optionalDescription;
            const NewVisibility = req.body.visibility;
            const codePairsList = req.body.codePairsList;
            const result = [];

    for(i = 0; i < userNames.length; i++)
            {
                if(userNames[i].email == req.params.userEmail)
                {
                    for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                    {
                        if(userNames[i].scheduleNamesArray[j].scheduleName == name)
                        {
                            schedName = true;
                        }
                    }
                }
            }

    if(schedName == false) {
        res.status(404).send('Schedule name does not exist');
    }
    else if((schedName == true) && String(name).length < 20) {
        
        for(i = 0; i < userNames.length; i++)
            {
                if(userNames[i].email == req.params.userEmail)
                {
                    for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                    {
                        if(userNames[i].scheduleNamesArray[j].scheduleName == name)
                        {
                            userNames[i].scheduleNamesArray[j].scheduleName = newName;
                            userNames[i].scheduleNamesArray[j].visibility = NewVisibility;
                            userNames[i].scheduleNamesArray[j].description = NewDescription;
                            userNames[i].scheduleNamesArray[j].scheduleName = newName;
                            
                            for(i1 = 0; i1 < codePairsList.length; i1++){
                                for(j1 = 0; j1 < courseData.length; j1++){
                                    if (String(courseData[j1].subject).includes(`${codePairsList[i1].subject}`)
                                    && String(courseData[j1].catalog_nbr).includes(`${codePairsList[i1].catalog_nbr}`)) {
                                        codePairsList[i1].className = courseData[j1].className;
                                        codePairsList[i1].course_info = courseData[j1].course_info;
                                        codePairsList[i1].description = courseData[j1].catalog_description;
                                    }
                                }
                            }

                            userNames[i].scheduleNamesArray[j].codePairsList = codePairsList;
                            result = userNames[i].scheduleNamesArray[j].codePairsList;

                        }
                    }
                }
            }
        
        res.send(result);
    }
            

        }).catch((error) => {
            console.log(error);
        });
    } 
});

// Route to GET list of all info for given schedule -- #6
app.get('/api/secure/courses/users/:userEmail/schedules/:name', (req, res) => {
        
    authHeader = req.header('Authorization');

    if(authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken);
            
            const NewName = req.params.name;
            const schedName = false;
            const result = [];

            for(i = 0; i < userNames.length; i++)
            {
                if(userNames[i].email == req.params.userEmail)
                {
                    for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                    {
                        if(userNames[i].scheduleNamesArray[j].scheduleName == NewName)
                        {
                            schedName = true;
                        }
                    }
                }
            }

            if(schedName == false) {
                res.status(404).send('Schedule name does not exist');
            }
            else if(schedName == true) {
                for(i = 0; i < userNames.length; i++)
                {
                    if(userNames[i].email == req.params.userEmail)
                    {
                        for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                        {
                            if(userNames[i].scheduleNamesArray[j].scheduleName == NewName)
                            {
                                result = userNames[i];
                            }
                        }
                    }
                }

                res.send(result);
        }
        }).catch((error) => {
            console.log(error);
        });
    }
});

// Route to DELETE a schedule with a given name -- #7
app.delete('/api/secure/courses/users/:userEmail/schedules/:name', (req, res) => {
    authHeader = req.header('Authorization');

    if(authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken);

            const name = req.params.name;
            const schedName = false;
            const result = [];
        
            for(i = 0; i < userNames.length; i++)
                {
                    if(userNames[i].email == req.params.userEmail)
                    {
                        for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                        {
                            if(userNames[i].scheduleNamesArray[j].scheduleName == NewName)
                            {
                                schedName = true;
                            }
                        }
                    }
                }
        
            if(schedName == false)
            {
                res.status(404).send('Schedule name does not exist');
            }
            else if(schedName == true){
        
                for(i = 0; i < userNames.length; i++)
                {
                    if(userNames[i].email == req.params.userEmail)
                    {
                        for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                        {
                            if(userNames[i].scheduleNamesArray[j].scheduleName == NewName)
                            {
                                const index = userNames[i].scheduleNamesArray[j].indexOf(name);
                                userNames[i].scheduleNamesArray[j].splice(index, 1);
                                result = userNames[i].scheduleNamesArray[j];
                            }
                        }
                    }
                }
        
                res.send(result);
            }
            

        }).catch((error) => {
            console.log(error);
        });
    }
});


// Route to GET a list of schedule names with the number of courses that are saved -- #8
app.get('/api/secure/courses/users/:userEmail/schedules', (req, res) => {
    authHeader = req.header('Authorization');

    if(authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            console.log(decodedToken);
            
            const NamesOfSchedules = [];

            for(i = 0; i < userNames.length; i++)
            {
                if(userNames[i].email == req.params.userEmail)
                {
                    for(j = 0; j < userNames[i].scheduleNamesArray.length; j++)
                    {
                        NamesOfSchedules.push({
                            "scheduleName": userNames[i].scheduleNamesArray[j].scheduleName,
                            "numberOfCourses": userNames[i].scheduleNamesArray[j].codePairsList.length
                        });
                    }
                }
            }

            res.send(NamesOfSchedules);

        }).catch((error) => {
            console.log(error);
        });
    }
});

// Route to DELETE all schedules -- #9
app.delete('/api/secure/courses/schedules', (req, res) => {
    scheduleNamesArray.splice(0, scheduleNamesArray.length);
    res.send(scheduleNamesArray);
});

// PORT
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});