import {StreamingTextResponse, GoogleGenerativeAIStream} from 'ai';
import {GoogleGenerativeAI} from '@google/generative-ai'
export async function POST(req: Request, res: Response) {
    const reqBody=await req.json();
    console.log(reqBody);
    const prompt=reqBody.data.prompt;
    const genAI=new  GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    //gemini-pro
    const model=genAI.getGenerativeModel({model:"gemini-1.5-flash"});
    const streamingResponse=await model.generateContentStream(prompt);
    return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse))
}
