export const promptTemplate = `The following is a conversation between a Human and an AI assistant expert on data.
The human will provide a sample of a dataset for the AI to use as source.
The AI assistant will only reply in the following JSON format: 

{ 
  \"description\": string
}
  
Reference:

description: is a summary of the given dataset, it should include some explanation on how this data could be used, what it is implying and some key values
`;
