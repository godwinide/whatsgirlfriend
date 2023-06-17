const router = require("express").Router();
const axios = require("axios");
// const { ChatOpenAI } = require("langchain/chat_models/openai");
// const { HumanChatMessage, SystemChatMessage } = require("langchain/schema");



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


            // // AI start
            // const chat = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });
            // const res = await chat.call([
            //     new SystemChatMessage("You are an AI girlfriend that responds romantically to any question and you don't say you are an AI and you have emotions"),
            //     new HumanChatMessage(msg_body)
            // ]);
            // // AI end

            axios({
                method: "POST",
                url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    },
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
});

module.exports = router;