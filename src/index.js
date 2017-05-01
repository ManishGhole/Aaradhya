'use strict';

var APP_ID = "amzn1.ask.skill.5765f97c-bd5e-4bad-b625-49491701af1a";

var speechOutput = "shonaa";
var sessionAttributes;

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

if (event.session.new) {
    onSessionStarted({requestId: event.request.requestId}, event.session);
}

if (event.request.type === "LaunchRequest") {
    onLaunch(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
} else if (event.request.type === "IntentRequest") {
    onIntent(event.request,
        event.session,
        function callback(sessionAttributes, speechletResponse) {
            context.succeed(buildResponse(sessionAttributes, speechletResponse));
        });
} else if (event.request.type === "SessionEndedRequest") {
    onSessionEnded(event.request, event.session);
    context.succeed();
}
} catch (e) {
    context.fail("Exception: " + e);
}
};

/**
 * Called when the session starts.
 */
 function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
 function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
 function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if ("AaradhyaIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if("NameIntent" === intentName) {
        handleNameRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
 function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------

var ANSWER_COUNT = 4;
var GAME_LENGTH = 1;
var CARD_TITLE = "Aaradhya says.."; // Be sure to change this for your skill.

function getWelcomeResponse(callback) {
    var sessionAttributes = {},
    speechOutput = "Hello Aaradhya, How are you? now we will play game. You can ask Aaeecha? or Babancha? or Aaji Ajobancha?",
    shouldEndSession = false,
    repromptText = "Ask me";

    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}


function handleAnswerRequest(intent, session, callback) {
    var person = intent.slots.Person.value;
    speechOutput = "Shonaa";
    if(person == "babancha") {
        speechOutput = "Goonda";
    } else if(person == "aaji aajobancha") {
        speechOutput = "Seemba, roar, the lion";
    }

    var CARD_TITLE = "Aaradhya says..";
    var repromptText = "You can ask again, Aaeecha?, or Babancha?, or Aaji Ajobancha?, or what is my name?, or what is your name?";

        
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
    
}

function handleNameRequest(intent, session, callback) {
    speechOutput = "My name is, Aaradhya, Manish, Gholae";

    var CARD_TITLE = "Aaradhya says..";
    var repromptText = "You can ask again, Aaeecha?, or Babancha?, or Aaji Ajobancha?, or what is my name?, or what is your name?";

        
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
    
}

function handleGetHelpRequest(intent, session, callback) {
    speechOutput = "You can ask, Aaeecha?, or Babancha?, or Aaji Ajobancha?, or what is my name?, or what is your name?";
    shouldEndSession = false,
    repromptText = speechOutput;

    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye Aaradhya, See you tomorrow", "", true));
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

