# EchoMind

🎙️ **EchoMind** is an intelligent transcription and summarization tool designed to convert audio inputs into actionable insights. It leverages advanced AI APIs like Deepgram for transcription and Gemini for summarization, making it a powerful assistant for meetings, lectures, and more.

---

## 🚀 Features

- **Audio Transcription**: Converts audio files into text with high accuracy.
- **Summarization**: Generates concise summaries and actionable tasks from transcriptions.
- **Drag-and-Drop Upload**: Easily upload audio files via a user-friendly interface.
- **Mobile Responsive**: Fully optimized for mobile and desktop devices.
- **Error Handling**: Gracefully manages API limits and errors.

---

## 🛠️ Tech Stack

### Frontend:
- **React** with **Next.js**
- **Tailwind CSS** for styling

### Backend:
- **FastAPI**
- **Python**

### APIs:
- **Deepgram** for transcription
- **Gemini** for summarization

---

## 🖥️ Local Development

### Prerequisites
- Node.js
- Python 3.11+
- Virtual Environment (optional but recommended)

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sushanthr1411/EchoMind.git
   cd EchoMind
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following keys:
     ```env
     GEMINI_API_KEY=your_gemini_api_key
     DEEPGRAM_API_KEY=your_deepgram_api_key
     ```

---

## 🌐 Deployment

### Frontend:
- Use **Vercel** or **Netlify** for seamless deployment.

### Backend:
- Deploy on **Heroku**, **AWS**, or **Google Cloud**.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

---

## 📧 Contact

For inquiries or support, reach out to [Sushanth R](mailto:sushanthr1411@example.com).
