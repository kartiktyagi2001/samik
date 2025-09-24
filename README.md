# Samik: Unified API Aggregation Layer

## 🚀 Overview
**Samik** aggregates multiple APIs into a single normalized endpoint, simplifying integration by unifying varied responses and providing detailed metadata.

## ✨ Features
- ⚡ Aggregates data concurrently from multiple APIs  
- 🔄 Normalizes diverse response formats into a single schema  
- 📊 Tracks success, failures, and performance metrics  
- 🖥️ User-friendly frontend to select and run API groups  
- 🧩 Modular backend for easy extension  

## 🛠️ Installation

### Prerequisites
- Node.js >= 18.x  
- PostgreSQL  
- npm  

### Setup
1. **Clone the repository**  
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Configure environment variables** in a `.env` file  
   - Database URL  
   - API keys  

4. **Run database migrations**  
   ```bash
   npx prisma migrate deploy
   ```

5. **Start backend and frontend**  
   ```bash
   npm run dev:server
   npm run dev
   ```

6. Open your browser and visit → [http://localhost:3000](http://localhost:3000)

## 📖 Usage
- Define API groups and add API sources  
- Select a group in the frontend and run it to get **aggregated data + metadata**

## 🗺️ Roadmap
- 🗃️ Add Redis caching for faster responses  
- ⏳ Implement rate limiting for robustness  
- 🔍 Enhance data normalization capabilities  
- 🔑 Add user authentication & authorization  
- 📡 Support real-time streaming and third-party integrations  

## 🤝 Contributing
Contributions are welcome! Please open an **issue** or **pull request** to discuss improvements.

## 📜 License
MIT License  

---

Engineered with passion by **Kartik Tyagi**
