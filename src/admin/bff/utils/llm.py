from core.config import settings
# from openai import AzureOpenAI


def ask(question: str):
    messages = [
        {"role": "system", "content": ""},
        {"role": "user", "content": question},
    ]

    # client = AzureOpenAI(
    #     api_key=settings.LLM_API_KEY,
    #     azure_endpoint=settings.LLM_API_BASE,
    #     api_version=settings.LLM_API_VERSION,
    #     azure_deployment=settings.LLM_DEPLOYMENT_NAME,
    # )

    # response = client.chat.completions.create(model="<ignored>", messages=messages)

    # return response.choices[0].message.content

    return "success"
