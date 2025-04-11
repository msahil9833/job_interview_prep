import {generateText} from "ai";
import {google} from '@ai-sdk/google';
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin";


export async function GET(){
    return Response.json({ success: true , data: 'Thanks for us!'},{ status: 200});
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();

    try{
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare question fro a job interview.
            the job role is ${role}.
            the job experience level is ${level}
            the tech stack used in the job is : ${techstack}.
            the focus between behavioural and technical question should lean towards: ${type}.
            the amount of question require is : ${amount}.
            please return only the question, without any additional text.
            the question are going to be read by a voice assistant so do not use '/' or '*' or any other special characters which might break the voice assistant.
            Return the question formatted like this:
            ["question 1","question 2","question 3"]
            thank you ! <3
            `,
        });

         const interview = {
             role, type, level,
             techstack: techstack.split(','),
             questions: JSON.parse(questions),
             userId: userid,
             finalized: true,
             coverImage: getRandomInterviewCover(),
             createdAt: new Date().toISOString()
         }
         await db.collection("interviews").add(interview);
         return Response.json({ success: true},{status: 200})

    }catch(error) {
        console.log(error);

        return Response.json({ success: false, error },{status: 500});
    }
}