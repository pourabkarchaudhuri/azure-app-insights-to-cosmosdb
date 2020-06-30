var fs = require('fs');
const {
    BlobServiceClient
} = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');

function EventParser(input){
    let eventData = input.context;
    let eventCategory = Object.keys(eventData.custom.metrics[0])[0]
    let result = {
        eventTime: eventData.data.eventTime,
        eventName: eventData.custom.dimensions[0].target,
        eventCategory: eventCategory,
        eventDuration:eventData.custom.metrics[0][eventCategory].sampledValue,
        userId: eventData.user.anonId,
        sessionId: eventData.session.id,
        osVersion: eventData.device.osVersion,      
        continent: eventData.location.continent,
        country: eventData.location.country,
        city: eventData.location.city
        
    }

    return result;
}

module.exports = async function (context, myBlob) {
    context.log("Triggering...");
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");
    var input = context.bindings.inputBlob;

    var inputType = typeof(input)
    var payload = [];
    if(inputType == "object"){
        //Single entry
        
        if(input.hasOwnProperty('metric')){
                context.log("Is Metric : ", JSON.stringify(input));   
                payload.push(EventParser(input));
        }
        else{
            context.log("Not metric, skip for single!")
            context.done();
        }
    }

    else if(inputType == "string"){
        //Multi-entry
        var dataArray = input.split("\n");
        dataArray = dataArray.slice(0, -1)

        payload = [];

        for(i in dataArray) {

            let parsedDataArray = JSON.parse(dataArray[i]);
            
            if(parsedDataArray.hasOwnProperty('metric')){
                context.log("Is Metric : ", parsedDataArray);
                payload.push(EventParser(parsedDataArray))
            }
            else{
                context.log("Not metric, skip for multiple!")
                context.done();
            }
        }
    }
    
    else{
        context.log("Unknown format error : ", inputType);
        context.done();
    }

    context.log("Final : ", JSON.stringify(payload))
    context.bindings.outputDocument = payload
    context.done();

};