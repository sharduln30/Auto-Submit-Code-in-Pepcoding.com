let fs = require("fs");
let path = require("path");

require('chromedriver');
let swd = require('selenium-webdriver');
let bldr = new swd.Builder();
let driver = bldr.forBrowser('chrome').build();

let cfile = process.argv[2];
let mfile = process.argv[3];
let cname = process.argv[4];

let userName, pwd, metadata;
let gcrsElements, gcrsi = 0, gcrsurl;
let gEditorTextBox, gcode, gcustomInputTextbox;
let gModuleElements, gLectureElements, gQuestionElements;

let cfileWillBeReadPromise = fs.promises.readFile(cfile);
cfileWillBeReadPromise.then(function (content) {
    let credentials = JSON.parse(content);
    userName = credentials.un;
    pwd = credentials.pwd;
}).then(function () {
    console.log("\n************************ START *********************************\n");
    let toWillBeSetPromise = driver.manage().setTimeouts({
        implicit: 10000
    });
    return toWillBeSetPromise;
}).then(function () {
    console.log("Logging in.....");
    let loginPageWillBeLoadedPromise = driver.get("https://www.pepcoding.com/login");
    return loginPageWillBeLoadedPromise;
}).then(function () {
    console.log("Entering Credentials");
    let uneWillBeFoundPromise = driver.findElement(swd.By.css("input[type=email]"));
    let pwdeWillBeFoundPromise = driver.findElement(swd.By.css("input[type=password]"));
    let bothElementsWillBeFoundPromise = Promise.all([uneWillBeFoundPromise, pwdeWillBeFoundPromise]);
    return bothElementsWillBeFoundPromise;
}).then(function (elements) {
    let userNameWillBeEnteredPromise = elements[0].sendKeys(userName);
    let pwdWillBeEnteredPromise = elements[1].sendKeys(pwd);
    let bothValuessWillBeEnteredPromise = Promise.all([userNameWillBeEnteredPromise, pwdWillBeEnteredPromise]);
    return bothValuessWillBeEnteredPromise;
}).then(function () {
    console.log("Logged In Successfully");
    let btnSubmitWillBeFoundPromise = driver.findElement(swd.By.css("button[type=submit]"));
    return btnSubmitWillBeFoundPromise;
}).then(function (btnSubmit) {
    let btnSubmitWillBeClickedPromise = btnSubmit.click();
    return btnSubmitWillBeClickedPromise;
}).then(function () {
    // s2 -> link ka wait karein, uska href read karein, aur driver.get kar jaien
    let waitForRLinkToBeLocatedPromise = driver.wait(swd.until.elementLocated(swd.By.css('div.resource a')));
    return waitForRLinkToBeLocatedPromise;
}).then(function (rlinkElement) {
    console.log("Getting into \"Resources\"");
    let rlinkHrefWillBeReadPromise = rlinkElement.getAttribute('href');
    return rlinkHrefWillBeReadPromise;
}).then(function (rlinkhref) {
    let rPageWillBeLoadedPromise = driver.get(rlinkhref);
    return rPageWillBeLoadedPromise;
}).then(function () {
    let siteOverlayElementWillBeFoundPromise = driver.findElement(swd.By.css("div#siteOverlay"));
    return siteOverlayElementWillBeFoundPromise;
}).then(function (soe) {
    let willWaitForSOToHidePromise = driver.wait(swd.until.elementIsNotVisible(soe), 10000);
    return willWaitForSOToHidePromise;
}).then(function () {
    let courseElementsWillBeFoundPromise = driver.findElements(swd.By.css('h2.courseInput'));
    return courseElementsWillBeFoundPromise;
}).then(function (crsElements) {
    gcrsElements = crsElements;

    let ceTextPromises = [];
    for (let i = 0; i < gcrsElements.length; i++) {
        ceTextPromises.push(gcrsElements[i].getText());
    }

    let combinedTextPromiseForAllCourseElements = Promise.all(ceTextPromises);
    return combinedTextPromiseForAllCourseElements;
}).then(function (ceTexts) {
    console.log("Getting into " + "\"" + cname + "\"");
    for (let i = 0; i < ceTexts.length; i++) {
        if (cname === ceTexts[i]) {
            gcrsi = i;
            break;
        }
    }
    
    let courseElementWillBeClickedPromise = gcrsElements[gcrsi].click();
    return courseElementWillBeClickedPromise;
}).then(function () {
    let urlWillBeRetreivedPromise = driver.getCurrentUrl();
    return urlWillBeRetreivedPromise;
}).then(function (url) {
    gcrsurl = url;
    let metadataFileWillBeReadPromise = fs.promises.readFile(mfile);
    return metadataFileWillBeReadPromise;
}).then(function (content) {
    metadata = JSON.parse(content);

}).then(function () {
    console.log("Solving Questions: \n");
    let pqp = solveQuestion(metadata.questions[0])
    for (let i = 1; i < metadata.questions.length; i++) {
        pqp = pqp.then(function () {
            let cqp = solveQuestion(metadata.questions[i]);
            return cqp;
        })
    }
    return pqp;
}).then(function () {
    console.log('Task Completed Successfully!');
    console.log("\n************************* END **********************************\n");
}).catch(function (err) {
    console.log(err)
}).finally(function () {
    driver.quit();
});

let gidx=0;

function solveQuestion(question) {
    //this will solve the question asynchronously and will return the promise to do so.
    return new Promise(function (resolve, reject) {
        gidx+=1;
        console.log("\n**************** Question "+gidx+ " Started ***************************\n");
        let questWillBeLoadedPromise = openTheQuestion(question);
        questWillBeLoadedPromise.then(function () {
            let editorButtonWillBeFoundPromise = driver.findElement(swd.By.css(".editorTab"));
            return editorButtonWillBeFoundPromise;
        }).then(function (editorTab) {
            console.log("Editor Tab is clicked");
            let editorTabWillBeClickedPromise = editorTab.click();
            return editorTabWillBeClickedPromise;
        }).then(function () {
            let editorTextBoxWillBeFoundPromise = driver.findElement(swd.By.css("textarea.ace_text-input"));
            return editorTextBoxWillBeFoundPromise;
        }).then(function (editorTextBox) {
            console.log("ctrl+a performed on the textarea");
            gEditorTextBox = editorTextBox;
            let ctrlaWillBeDonePromise = gEditorTextBox.sendKeys(swd.Key.chord(swd.Key.CONTROL, 'a'));
            return ctrlaWillBeDonePromise;
        }).then(function () {
            console.log("DELETE performed on the textarea");
            let deleteWillBeDonePromise = gEditorTextBox.sendKeys(swd.Key.DELETE);
            return deleteWillBeDonePromise;
        }).then(function () {
            let codeFileWillBeReadPromise = fs.promises.readFile(path.join(question.path, "main.java"));
            return codeFileWillBeReadPromise;
        }).then(function (contents) {
            gcode = contents + "";
            let customInputTextBoxWillBeReadPromise = driver.findElement(swd.By.css("#customInput"));
            return customInputTextBoxWillBeReadPromise;
        }).then(function (customInputTextBox) {
            console.log("Code is copying inside custom input");
            gcustomInputTextbox = customInputTextBox;
            let codeWillBeEnteredPromise = gcustomInputTextbox.sendKeys(gcode);
            return codeWillBeEnteredPromise;
        }).then(function () {
            let willWaitForOverlayDismissalPromise = willWaitForOverlayDismissal();
            return willWaitForOverlayDismissalPromise;;
        }).then(function () {
            console.log("ctrl+a performed on the custom input text");
            let ctrlaWillBeDonePromise = gcustomInputTextbox.sendKeys(swd.Key.chord(swd.Key.CONTROL, 'a'));
            return ctrlaWillBeDonePromise;
        }).then(function () {
            console.log("ctrl+x performed on the custom input text");
            let ctrlxWillBeDonePromise = gcustomInputTextbox.sendKeys(swd.Key.chord(swd.Key.CONTROL, 'x'));
            return ctrlxWillBeDonePromise;
        }).then(function () {
            let ctrlvWillBeDonePromise = gEditorTextBox.sendKeys(swd.Key.chord(swd.Key.CONTROL, 'v'));
            console.log("ctrl+v performed on the testarea");
            return ctrlvWillBeDonePromise;
        }).then(function () {
            console.log('Submit button is clicked')
            let submitCodeWillBeFoundPromise = driver.findElement(swd.By.css('#submitCode'));
            return submitCodeWillBeFoundPromise;
        }).then(function (btnSubmit) {
            let btnSubmitWillBeClickedPromise = btnSubmit.click();
            return btnSubmitWillBeClickedPromise;
        }).then(function () {
            let willWaitForOverlayDismissalPromise = willWaitForOverlayDismissal();
            return willWaitForOverlayDismissalPromise;
        }).then(function () {
            console.log('TestCase is downloading...');
            let liTestcaseWillBeFoundPromise = driver.findElements(swd.By.css('#testCases'));
            return liTestcaseWillBeFoundPromise;
        }).then(function (liTestCases) {
            let tcHiddenElementWillBeReadPromiseArr = [];
            for (let i = 0; i < liTestCases.length; i++) {
                let tcHiddenElementWillBeReadPromise = liTestCases[i].findElements(swd.By.css("input[type=hidden"));
                tcHiddenElementWillBeReadPromiseArr.push(tcHiddenElementWillBeReadPromise);
            }
            return Promise.all(tcHiddenElementWillBeReadPromiseArr);
        }).then(function (tcHiddenElements) {
            let tcValuesWillBeReadPromiseArr = [];
            for (let i = 0; i < tcHiddenElements.length; i++) {
                let tcInputWillBeReadPromise = tcHiddenElements[i][0].getAttribute('value');
                let tcEOWillBeReadPromise = tcHiddenElements[i][1].getAttribute('value');
                let tcAOWillBeReadPromise = tcHiddenElements[i][2].getAttribute('value');
                let combinePromise = Promise.all([tcInputWillBeReadPromise, tcEOWillBeReadPromise, tcAOWillBeReadPromise]);
                tcValuesWillBeReadPromiseArr.push(combinePromise);
            }
            return Promise.all(tcValuesWillBeReadPromiseArr);
        }).then(function (testcases) {
            let tcObj = testcases.map(function (testcase) {
                return {
                    input: testcase[0],
                    exo: testcase[1],
                    aco: testcase[2]
                }
            });
            console.log('Copying Testcases to tc.json');
            let tcWillBeWrittenToFilePromise = fs.promises.writeFile(path.join(question.path, "tc.json"), JSON.stringify(tcObj));
            return tcWillBeWrittenToFilePromise;
        }).then(function () {
            console.log("\n**************** Question "+gidx+ " Completed ***************************\n");
            resolve();
        }).catch(function (err) {
            console.log(err);
            reject();
        }).finally(function () {
            // driver.quit();
        })
    });
}



function openTheQuestion(question) {
    //s1 -> open the curl>click module>click lecture>click question
    return new Promise(function (resolve, reject) {
        //s2 -> open the qurl directly
        let coursePageWillBeLoadedPromise = driver.get(gcrsurl);
        coursePageWillBeLoadedPromise.then(function () {
            let willWaitForOverlayDismissalPromise = willWaitForOverlayDismissal();
            return willWaitForOverlayDismissalPromise;
        }).then(function () {
            let moduleElementsWillBeReadPromise = driver.findElements(swd.By.css('ul.tabs div.hoverable'));
            return moduleElementsWillBeReadPromise;
        }).then(function (moduleElements) {
            gModuleElements = moduleElements;
            let moduleTextsPromiseArr = [];
            for (let i = 0; i < moduleElements.length; i++) {
                let moduleTextWillBeReadPromise = gModuleElements[i].getText();
                moduleTextsPromiseArr.push(moduleTextWillBeReadPromise);
            }
            return Promise.all(moduleTextsPromiseArr);
        }).then(function (moduleTexts) {
            let properModuleElementWillBeClickedPromise;
            for (let i = 0; i < moduleTexts.length; i++) {
                console.log("Module " + "\"" + question.module + "\"" + " is clicked");
                if (question.module === moduleTexts[i].trim()) {
                    properModuleElementWillBeClickedPromise = gModuleElements[i].click();
                    break;
                }
            }

            return properModuleElementWillBeClickedPromise;
        }).then(function () {
            let lectureElementsWillBeReadPromise = driver.findElements(swd.By.css('ul.collection li.collection-item p.title'));
            return lectureElementsWillBeReadPromise;
        }).then(function (LectureElements) {
            gLectureElements = LectureElements;

            let lectureTextsPromiseArr = [];
            for (let i = 0; i < gLectureElements.length; i++) {
                let lectureTextWillBeReadPromise = gLectureElements[i].getText();
                lectureTextsPromiseArr.push(lectureTextWillBeReadPromise);
            }
            return Promise.all(lectureTextsPromiseArr);
        }).then(function (lectureTexts) {
            console.log("Module " + "\"" + question.lecture + "\"" + " is clicked");
            let properLectureElementWillBeClickedPromise;

            for (let i = 0; i < lectureTexts.length; i++) {
                if (question.lecture === lectureTexts[i].trim()) {
                    properLectureElementWillBeClickedPromise = gLectureElements[i].click();
                    break;
                }
            }
            return properLectureElementWillBeClickedPromise;
        }).then(function () {
            let willWaitForOverlayDismissalPromise = willWaitForOverlayDismissal();
            return willWaitForOverlayDismissalPromise;;
        }).then(function () {
            let questionElementWillBeReadPromise = driver.findElements(swd.By.css('ul.collection li.collection-item p'));
            return questionElementWillBeReadPromise;
        }).then(function (questionElements) {
            gQuestionElements = questionElements;

            let questionTextsPromiseArr = [];
            for (let i = 0; i < gQuestionElements.length; i++) {
                let questionTextWillBeReadPromise = gQuestionElements[i].getText();
                questionTextsPromiseArr.push(questionTextWillBeReadPromise);
            }
            return Promise.all(questionTextsPromiseArr);
        }).then(function (questionTexts) {
            console.log("Module " + "\"" + question.title + "\"" + " is clicked");
            let properQuestionElementWillBeClickedPromise;

            for (let i = 0; i < questionTexts.length; i++) {
                if (questionTexts[i].trim().includes(question.title)) {
                    properQuestionElementWillBeClickedPromise = gQuestionElements[i].click();
                    break;
                }
            }
            return properQuestionElementWillBeClickedPromise;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        })
    });
}

function willWaitForOverlayDismissal() {
    return new Promise(function (resolve, reject) {
        let siteOverlayElementWillBeFoundPromise = driver.findElement(swd.By.css("div#siteOverlay"));
        siteOverlayElementWillBeFoundPromise.then(function (soe) {
            let willWaitForSOToHidePromise = driver.wait(swd.until.elementIsNotVisible(soe), 10000);
            return willWaitForSOToHidePromise;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err);
        })
    });
}
