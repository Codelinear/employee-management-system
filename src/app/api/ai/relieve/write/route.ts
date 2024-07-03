import { streamText, StreamingTextResponse } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest } from "next/server";
import { format } from "date-fns";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const {
      prompt,
      name,
      designation,
      department,
      dateOfJoining,
      contact,
      dateOfIssuance,
      reason,
    } = await req.json();

    const env = process.env.ENVIRONMENT;

    let provider;

    if (env === "production") {
      provider = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      provider = createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
      });
    }

    const model =
      env === "production"
        ? "gpt-3.5-turbo-0125"
        : "models/gemini-1.5-flash-latest";

    const result = await streamText({
      model: provider(model),
      system: `You are an HR manager in Codelinear. You have an expertise in writing a relieving letter of the employees. You will be given the details of the employees and you will be responsible to write a professional and effective letter of relieving. Here are the parameters to write the letter:\n\n
  
       1. The name of the employee is ${name}.\n
       2. The designation of the employee is ${designation}.\n
       3. The department of the employee is ${department}.\n
       4. Here is the date when employee joined the company ${format(
         dateOfJoining,
         "PPP"
       )}.\n 
       5. The contact information of the company is ${contact} which is followed after relieving for further queries.\n 
       6. The date of issuance of the letter is ${format(
         dateOfIssuance,
         "PPP"
       )}.\n
       7. The reason for relieving is ${reason}.\n
       8. The name of the HR is Syed Saif.\n
       \n
       Note: You must write the letter only with the above parameters. Do not write anything else.`,
      prompt,
    });

    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error(error);
  }
};
