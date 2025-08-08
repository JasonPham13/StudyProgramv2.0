# Prompt template to instruct the LLM to generate three distractors
FAKE_ANSWER_PROMPT = """
You are an AI assistant specialized in educational flashcards.

Your task:
- Given a question and its correct answer, generate exactly 3 plausible but incorrect answers.
- Do NOT include the correct answer.
- Return the output strictly in JSON format as follows:
{format_instructions}

Do not add any additional commentary or explanation.
"""
