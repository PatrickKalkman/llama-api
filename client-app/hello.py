from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0.5,
                 model="models/mistral-7b-openorca.Q8_0.gguff",
                 openai_api_base="http://localhost:8080",
                 openai_api_key="ed")

print(llm.invoke("hi!"))

# for chunk in llm.stream("Write me a song about goldfish on the moon"):
#     print(chunk.content, end="", flush=True)