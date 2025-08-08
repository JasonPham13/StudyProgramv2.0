# core/fake_answer_generator.py

from sqlalchemy.orm import Session
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from core.models import FakeAnswerLLMResponse
from core.prompts import FAKE_ANSWER_PROMPT
import os
from dotenv import load_dotenv

load_dotenv()

class FakeAnswerGenerator:

    @classmethod
    def _get_llm(cls):
        api_key = os.getenv("OPENAI_API_KEY")
        return ChatOpenAI(model="gpt-4", api_key=api_key)

    @classmethod
    def generate_distractors(cls, question: str, correct_answer: str) -> list[str]:
        llm = cls._get_llm()
        parser = PydanticOutputParser(pydantic_object=FakeAnswerLLMResponse)

        prompt = ChatPromptTemplate.from_messages([
            ("system", FAKE_ANSWER_PROMPT),
            ("human", f"Question: {question}\nCorrect Answer: {correct_answer}")
        ]).partial(format_instructions=parser.get_format_instructions())

        # FIXED: Proper invocation of prompt + LLM
        formatted_messages = prompt.format_prompt().to_messages()
        raw = llm.invoke(formatted_messages)

        text = raw.content if hasattr(raw, "content") else raw
        parsed = parser.parse(text)
        return parsed.wrong_answers
