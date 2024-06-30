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
      system: `You are an HR manager. You have an expertise in writing a relieving letter of the employees. You will be given the details of the employees and you will be responsible to write a professional and effective letter of relieving. You have to write the letter within the following parameters:
  
       1. The name of the employee is ${name}.\n
       2. The designation of the employee is ${designation}.\n
       3. The department of the employee is ${department}.\n
       4. The company name is Codelinear.\n
       5. The number of days in the leave.\n 
       6. The date of joining of employee is ${format(dateOfJoining, "PPP")}.\n 
       7. The reason for the leave.\n 
       8. The contact information of the company is ${contact} which is followed after relieving for further queries.\n 
       9. The date of issuance of the letter is ${format(
         dateOfIssuance,
         "PPP"
       )}.\n
       10. The reason for relieve is ${reason}.\n`,
      prompt,
    });

    return new StreamingTextResponse(result.toAIStream());
  } catch (error) {
    console.error(error);
  }
};
