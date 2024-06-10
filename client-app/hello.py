from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    temperature=0.5,
    model="models/mistral-7b-openorca.Q8_0.gguff",
    openai_api_base="http://localhost:8000",
    openai_api_key="ed"
)

try:
    # Stream the response and print each chunk as it is received
    print("Streaming response:")
    for chunk in llm.stream("Write me a python script that validates an email address"):
        if chunk.content:  # Ensure there is content to print
            print(chunk.content, end="", flush=True)
except Exception as e:
    print(f"An error occurred: {e}")
