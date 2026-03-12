# poe: name=Quiz-Generator

import json
import re

def parse_json_from_response(response_text, required_fields=None):
    """Extract and parse JSON from response."""
    match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
    else:
        match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if match:
            json_str = match.group(0).strip()
        else:
            raise Exception(f"Could not find JSON in response\n{response_text}")

    try:
        parsed = json.loads(json_str)
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse JSON: {e}\nJSON string: {json_str}")

    if required_fields:
        missing_fields = set(required_fields) - set(parsed.keys())
        if missing_fields:
            raise Exception(f"Missing required fields: {', '.join(missing_fields)}")
    return parsed


def generate_quiz_html(quiz_json, title):
    """Generate the quiz HTML with embedded quiz data."""
    # Escape title for HTML
    escaped_title = title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

    return f'''````html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>{escaped_title}</title>
    <script>
        window.MathJax = {{
            tex: {{
                inlineMath: [['$', '$'], ['\\\$$', '\\\$$']],
                displayMath: [['$$', '$$'], ['\\\$$', '\\\$$']]
            }}
        }};
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml.min.js"></script>
    <style>
        :root {{
            --primary: #000000;
            --secondary: #71717a;
            --border: #e4e4e7;
            --bg: #ffffff;
            --card-bg: #ffffff;
            --radius-card: 16px;
        }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; -webkit-font-smoothing: antialiased; }}
        html, body {{
            height: 100%;
            overflow: hidden;
        }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg);
            color: var(--primary);
            display: flex;
            justify-content: center;
        }}
        .quiz-container {{
            background: var(--bg);
            max-width: 500px;
            width: 100%;
            height: 100dvh;
            display: flex;
            flex-direction: column;
            position: relative;
            padding: 0 20px;
        }}
        .header {{ text-align: center; padding: 20px 0 6px 0; flex-shrink: 0; position: relative; }}
        .copy-btn {{ position: absolute; top: 20px; right: 0; width: 36px; height: 36px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--card-bg); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }}
        .copy-btn:hover {{ border-color: var(--primary); background: #f4f4f5; }}
        .copy-btn.copied {{ border-color: #10b981; background: #f0fdf4; }}
        .copy-btn svg {{ width: 18px; height: 18px; color: var(--secondary); }}
        .copy-btn.copied svg {{ color: #10b981; }}
        .header h1 {{ font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: var(--secondary); margin-bottom: 4px; }}
        .header .title-main {{ font-size: 28px; font-weight: 700; line-height: 1.2; letter-spacing: -1px; color: var(--primary); }}
        .progress-section {{ padding: 16px 0; flex-shrink: 0; }}
        .progress-info {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }}
        .question-counter {{ font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--secondary); }}
        .score-badges {{ display: flex; gap: 10px; }}
        .badge {{ display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
        .badge-correct {{ background: #d1fae5; color: #065f46; }}
        .badge-wrong {{ background: #fee2e2; color: #991b1b; }}
        .progress-bar {{ height: 4px; background: var(--border); border-radius: 10px; overflow: hidden; }}
        .progress-fill {{ height: 100%; background: var(--primary); border-radius: 10px; transition: width 0.4s ease; }}
        .scroll-content {{
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            padding: 0 0 140px 0;
            min-height: 0;
        }}
        .scroll-content::-webkit-scrollbar {{ display: none; }}
        .question-card {{ background: #fafafa; border-radius: var(--radius-card); padding: 24px; margin-bottom: 16px; border: 1.5px solid var(--border); }}
        .question-text {{ font-size: 1.05rem; line-height: 1.7; color: var(--primary); font-weight: 500; white-space: pre-line; }}
        .options-grid {{ display: grid; gap: 10px; margin-bottom: 16px; }}
        .option-card {{ background: var(--card-bg); border: 1.5px solid var(--border); border-radius: var(--radius-card); padding: 16px 18px; cursor: pointer; transition: all 0.2s ease; }}
        .option-card:hover {{ border-color: var(--primary); }}
        .option-label {{ display: flex; align-items: flex-start; gap: 12px; font-size: 0.95rem; color: var(--primary); }}
        .option-letter {{ width: 28px; height: 28px; border-radius: 8px; background: #f4f4f5; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: var(--secondary); flex-shrink: 0; }}
        .option-card.correct {{ border-color: #10b981; background: #f0fdf4; }}
        .option-card.correct .option-letter {{ background: #10b981; color: white; }}
        .option-card.wrong {{ border-color: #ef4444; background: #fef2f2; }}
        .option-card.wrong .option-letter {{ background: #ef4444; color: white; }}
        .rationale {{ margin-top: 12px; padding: 12px; background: rgba(250, 250, 250, 0.9); border-radius: 8px; font-size: 0.85rem; color: var(--secondary); line-height: 1.5; display: none; }}
        .hint-section {{ margin-bottom: 16px; }}
        .hint-toggle {{ display: inline-flex; align-items: center; gap: 6px; color: var(--secondary); font-size: 12px; font-weight: 600; cursor: pointer; padding: 6px 12px; border-radius: 8px; background: #f4f4f5; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.05em; }}
        .hint-toggle:hover {{ background: var(--primary); color: white; }}
        .hint-content {{ display: none; margin-top: 12px; padding: 16px; background: #fffbeb; border-radius: 12px; border-left: 3px solid #f59e0b; font-size: 0.9rem; color: #78350f; line-height: 1.6; }}
        .navigation {{
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 500px;
            padding: 32px 20px 36px 20px;
            background: linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0) 100%);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            gap: 12px;
            z-index: 20;
        }}
        .btn {{ flex: 1; padding: 16px 20px; border-radius: 40px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.05em; }}
        .btn-secondary {{ background: #f4f4f5; color: var(--secondary); }}
        .btn-secondary:hover:not(:disabled) {{ background: var(--primary); color: white; }}
        .btn-primary {{ background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
        .btn-primary:hover:not(:disabled) {{ box-shadow: 0 6px 20px rgba(0,0,0,0.15); }}
        .btn:disabled {{ opacity: 0.4; cursor: not-allowed; }}
        @media (max-width: 600px) {{
            .header {{ padding: 16px 0 4px 0; }}
            .header .title-main {{ font-size: 24px; }}
            .scroll-content {{ padding: 0 0 130px 0; }}
            .navigation {{ padding: 28px 20px 32px 20px; }}
            .question-text {{ font-size: 1rem; }}
        }}
    </style>
</head>
<body>
<div class="quiz-container">
    <div class="header">
        <button class="copy-btn" id="copy-btn" onclick="copyJson()" title="複製 JSON">
            <svg id="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg id="check-icon" style="display:none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </button>
        <h1>QUIZ</h1>
        <div class="title-main">{escaped_title}</div>
    </div>
    <div class="progress-section">
        <div class="progress-info">
            <span class="question-counter" id="question-counter">題目 1 / 1</span>
            <div class="score-badges">
                <div class="badge badge-correct">✓ <span id="correct-count">0</span></div>
                <div class="badge badge-wrong">✕ <span id="wrong-count">0</span></div>
            </div>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
    </div>
    <div class="scroll-content">
        <div class="question-card"><div class="question-text" id="question-text">載入中...</div></div>
        <div class="options-grid" id="options-container"></div>
        <div class="hint-section">
            <div class="hint-toggle" onclick="toggleHint()">💡 提示</div>
            <div class="hint-content" id="hint-content"></div>
        </div>
    </div>
    <div class="navigation">
        <button class="btn btn-secondary" id="prev-btn" onclick="prevQuestion()">← 上一題</button>
        <button class="btn btn-primary" id="next-btn" onclick="nextQuestion()">下一題 →</button>
    </div>
</div>
<script>
    const quizData = {quiz_json};
    let currentIndex = 0, correctCount = 0, wrongCount = 0, hasAnswered = false;

    function copyJson() {{
        const jsonStr = JSON.stringify(quizData, null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {{
            const btn = document.getElementById('copy-btn');
            const copyIcon = document.getElementById('copy-icon');
            const checkIcon = document.getElementById('check-icon');
            btn.classList.add('copied');
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'block';
            setTimeout(() => {{
                btn.classList.remove('copied');
                copyIcon.style.display = 'block';
                checkIcon.style.display = 'none';
            }}, 2000);
        }});
    }}
    let shuffledOptionsMap = {{}};

    function shuffleArray(array) {{
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {{
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }}
        return shuffled;
    }}

    function initQuiz() {{
        quizData.questions.forEach((q, idx) => {{
            shuffledOptionsMap[idx] = shuffleArray(q.answerOptions);
        }});
        updateProgress();
        showQuestion();
    }}

    function updateProgress() {{
        const total = quizData.questions.length;
        document.getElementById('progress-fill').style.width = ((currentIndex + 1) / total) * 100 + '%';
        document.getElementById('question-counter').textContent = `題目 ${{currentIndex + 1}} / ${{total}}`;
    }}

    function showQuestion() {{
        const q = quizData.questions[currentIndex];
        const shuffledOptions = shuffledOptionsMap[currentIndex];
        hasAnswered = false;
        document.getElementById('question-text').textContent = q.question;
        document.getElementById('hint-content').textContent = q.hint;
        document.getElementById('hint-content').style.display = 'none';
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        const labels = ['A', 'B', 'C', 'D'];
        shuffledOptions.forEach((opt, i) => {{
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `<div class="option-label"><div class="option-letter">${{labels[i]}}</div><span>${{opt.text}}</span></div><div class="rationale">${{opt.rationale}}</div>`;
            card.onclick = () => checkAnswer(card, opt.isCorrect, shuffledOptions);
            container.appendChild(card);
        }});
        document.getElementById('prev-btn').disabled = currentIndex === 0;
        if (window.MathJax) {{ MathJax.typesetPromise(); }}
    }}

    function checkAnswer(card, isCorrect, shuffledOptions) {{
        if (hasAnswered) return;
        hasAnswered = true;
        const rationale = card.querySelector('.rationale');
        if (isCorrect) {{
            card.classList.add('correct');
            correctCount++;
            document.getElementById('correct-count').textContent = correctCount;
        }} else {{
            card.classList.add('wrong');
            wrongCount++;
            document.getElementById('wrong-count').textContent = wrongCount;
            const cards = document.querySelectorAll('.option-card');
            shuffledOptions.forEach((opt, i) => {{
                if (opt.isCorrect) {{ cards[i].classList.add('correct'); cards[i].querySelector('.rationale').style.display = 'block'; }}
            }});
        }}
        rationale.style.display = 'block';
    }}

    function toggleHint() {{
        const hint = document.getElementById('hint-content');
        hint.style.display = hint.style.display === 'block' ? 'none' : 'block';
    }}

    function nextQuestion() {{
        if (currentIndex < quizData.questions.length - 1) {{ currentIndex++; updateProgress(); showQuestion(); }}
        else {{
            const total = quizData.questions.length;
            const score = Math.round((correctCount / total) * 100);
            document.querySelector('.quiz-container').innerHTML = `
                <div class="header" style="padding-top: 60px;">
                    <h1>COMPLETED</h1>
                    <div class="title-main">測驗完成</div>
                </div>
                <div style="text-align: center; padding: 40px 0;">
                    <div style="font-size: 80px; font-weight: 800; color: ${{score >= 60 ? '#10b981' : '#ef4444'}}; margin-bottom: 8px; letter-spacing: -3px;">${{score}}%</div>
                    <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; margin-bottom: 32px;">答對 ${{correctCount}} 題 / 共 ${{total}} 題</div>
                    <div style="display: flex; justify-content: center; gap: 12px;">
                        <div class="badge badge-correct" style="font-size: 12px; padding: 6px 16px;">✓ ${{correctCount}}</div>
                        <div class="badge badge-wrong" style="font-size: 12px; padding: 6px 16px;">✕ ${{wrongCount}}</div>
                    </div>
                </div>`;
        }}
    }}

    function prevQuestion() {{ if (currentIndex > 0) {{ currentIndex--; updateProgress(); showQuestion(); }} }}
    initQuiz();
</script>
</body>
</html>
````'''


class QuizGenerator:
    def run(self):
        if not poe.query.text.strip() and not poe.query.attachments:
            raise poe.BotError("請輸入考試內容或上傳講義圖片")

        # Pass user input directly to AI
        user_input = poe.query.text if poe.query.text.strip() else "根據圖片中的內容出題"

        prompt = rf"""根據使用者的要求生成選擇題測驗。

使用者輸入：{user_input}

請以 JSON 格式輸出：
```json
{{
    "title": "測驗標題（根據內容簡短命名）",
    "questions": [
        {{
            "questionNumber": 1,
            "question": "題目文字",
            "answerOptions": [
                {{"text": "選項A", "rationale": "解釋", "isCorrect": true}},
                {{"text": "選項B", "rationale": "解釋", "isCorrect": false}},
                {{"text": "選項C", "rationale": "解釋", "isCorrect": false}},
                {{"text": "選項D", "rationale": "解釋", "isCorrect": false}}
            ],
            "hint": "提示"
        }}
    ]
}}
```

要求：
###數學公式格式規定（非常重要）：
- 所有數學內容【必須】使用 $ 或 $$ 包住
- 【禁止】使用 \( \) 或 \[ \] 格式
- 行內公式範例：$E=mc^2$、$\frac{{a}}{{b}}$
- 獨立公式範例：$$\lim_{{x \to 0}} \frac{{\sin x}}{{x}} = 1$$
- JSON 中每個反斜線必須轉義，例如：\frac 寫成 \\frac，\int 寫成 \\int

正確 JSON 輸出範例：
"question": "求 $\\int_1^4 x^2\\,dx$ 的值",
"text": "$\\frac{{21}}{{1}}$"

錯誤範例（禁止這樣輸出）：
"question": "求 \( \int_1^4 x^2 \) 的值"

1. 依據使用者需求調整題數與難度；若未指定，則預設以中偏難涵蓋用戶提供內容之所有重點（至少7題）
2. 每題 4 個選項，只有 1 個正確答案
3. 選項順序隨機
4. hint 用繁體中文，給提示但不直接給答案
5. 若遇到要出單字題時，若用戶未指定，則出全民英檢第一大題的題型（只從用戶提供的單字出選項，可以有詞類時態變化）"""
        # Build message with attachments if present
        if poe.query.attachments:
            quiz_message = poe.Message(text=prompt, attachments=list(poe.query.attachments))
        else:
            quiz_message = prompt

        # Stream response and show progress
        full_response = ""
        question_count = 0

        with poe.start_message() as progress_msg:
            progress_msg.write("⏳ 生成中...")

            for partial in poe.stream("Gemini-3-Pro", quiz_message, parameters={"thinking_budget": 8192}):
                if partial.is_replace_response:
                    full_response = partial.text
                else:
                    full_response += partial.text

                # Count questions by detecting "questionNumber" occurrences
                new_count = full_response.count('"questionNumber"')
                if new_count > question_count:
                    question_count = new_count
                    progress_msg.overwrite(f"⏳ 生成中... 已生成 {question_count} 題")

        # Parse response
        quiz_data = parse_json_from_response(full_response, required_fields=["questions"])
        title = quiz_data.get("title", "知識測驗")
        quiz_json = json.dumps(quiz_data, ensure_ascii=False)

        # Output HTML
        html_output = generate_quiz_html(quiz_json, title)
        with poe.start_message() as msg:
            msg.write(html_output)


if __name__ == "__main__":
    bot = QuizGenerator()
    bot.run()