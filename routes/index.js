const router = require("express").Router();
const axios = require("axios");
require('dotenv').config();
const { OpenAI } = require("langchain/llms")
const { BufferMemory } = require("langchain/memory")
const { ConversationChain } = require("langchain/chains")
const { SystemChatMessage } = require("langchain/schema")

const token = process.env.TOKEN;



router.post("/webhook", async (req, res) => { //i want some 

    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.object) {
        console.log("inside body param");
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("boady param " + msg_body);

            airesponse(res, msg_body, phon_no_id, from)
        } else {
            res.sendStatus(404);
        }
    }
});


// AI

const model = new OpenAI({ openAIApiKey: process.env.openAIApiKey, temperature: 0.9 });


const airesponse = async (res, msg, phon_no_id, from) => {
    const memory = new BufferMemory();
    const chain = new ConversationChain({ llm: model, memory });

    const systemMessage = new SystemChatMessage("You are an AI girlfriend that responds romantically to any question");
    await chain.call({ input: systemMessage });

    const data = await chain.call({ input: msg });

    axios({
        method: "POST",
        url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
        data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
                body: data.response
            },
        },
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.sendStatus(200);
}

module.exports = router;