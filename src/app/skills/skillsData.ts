// src/app/skills/skillsData.ts
// Data used by the HUD skills page. Edit percentages & text as you like.

export const CATEGORIES = [
  {
    id: "prog",
    label: "Programming & Software Fundamentals",
    icon: "💻",
    title: "Programming & Software Fundamentals",
    description: "Python · JavaScript/TypeScript · SQL · Git · FastAPI · React · Testing",
    skills: [
      { id: "python", label: "Python", icon: "🐍", pct: 90 },
      { id: "js_ts", label: "JavaScript / TypeScript", icon: "🟦", pct: 86 },
      { id: "sql", label: "SQL", icon: "🗄️", pct: 78 },
      { id: "git", label: "Git, GitHub, CI/CD", icon: "🔧", pct: 84 },
      { id: "fastapi", label: "FastAPI / Flask", icon: "⚡", pct: 78 },
      { id: "react", label: "React / Next.js", icon: "⚛️", pct: 80 },
      
    ],
  },

  {
    id: "math",
    label: "Mathematics, Statistics & Optimization",
    icon: "∑",
    title: "Mathematics, Statistics & Optimization",
    description: "Linear Algebra · Calculus · Probability & Statistics · Optimization · Time Series",
    skills: [
      { id: "linear_algebra", label: "Linear Algebra", icon: "📐", pct: 82 },
      { id: "calculus", label: "Calculus", icon: "∫", pct: 76 },
      { id: "prob_stats", label: "Probability & Statistics", icon: "📊", pct: 79 },
      { id: "hypothesis", label: "Hypothesis Testing", icon: "🔎", pct: 74 },
      { id: "optimization", label: "Optimization (GD, Adam)", icon: "⚙️", pct: 72 },
      { id: "timeseries", label: "Time Series", icon: "📈", pct: 70 },
    ],
  },

  {
    id: "dataeng",
    label: "Data Engineering & Data Handling",
    icon: "🧰",
    title: "Data Engineering & Data Handling",
    description: "Pandas · NumPy · Data Cleaning · EDA · DBs · S3 / Azure Blob",
    skills: [
      { id: "pandas", label: "Pandas / NumPy", icon: "🧩", pct: 88 },
      { id: "data_clean", label: "Data Cleaning & FE", icon: "🧹", pct: 86 },
      { id: "eda", label: "Exploratory Data Analysis", icon: "🔬", pct: 84 },
      { id: "missing", label: "Missing Values & Outliers", icon: "🩺", pct: 80 },
      { id: "dbs", label: "MySQL / PostgreSQL", icon: "🗄️", pct: 78 },
      { id: "blob", label: "Blob Storage (S3, Azure)", icon: "☁️", pct: 75 },
      { id: "unstructured", label: "Structured/Unstructured Data", icon: "🗃️", pct: 74 },
    ],
  },

  {
    id: "ml",
    label: "Machine Learning (Classical ML)",
    icon: "🌳",
    title: "Machine Learning (Classical)",
    description: "Regression · Classification · Ensembles · Evaluation · Tuning",
    skills: [
      { id: "reg_clf", label: "Regression & Classification", icon: "📈", pct: 82 },
      { id: "clustering", label: "Clustering", icon: "🔵", pct: 70 },
      { id: "trees", label: "RandomForest / XGBoost / CatBoost", icon: "🌲", pct: 83 },
      { id: "eval_metrics", label: "Evaluation (AUC / F1 / K-Fold)", icon: "📊", pct: 82 },
      { id: "feature_sel", label: "Feature Selection / Dim. Reduction", icon: "🧠", pct: 76 },
      { id: "pca_tsne", label: "PCA / t-SNE", icon: "🧭", pct: 72 },
      { id: "hyper", label: "Hyperparameter Tuning", icon: "🎛️", pct: 77 },
      { id: "ensembles", label: "Ensembles (Bagging/Boosting)", icon: "🔗", pct: 78 },
    ],
  },

  {
    id: "dl",
    label: "Deep Learning & Computer Vision",
    icon: "🧠",
    title: "Deep Learning & Computer Vision",
    description: "NNs · CNNs · RNNs · Transformers · PyTorch · TF · OpenCV",
    skills: [
      { id: "nn", label: "Neural Networks", icon: "🤖", pct: 80 },
      { id: "cnn", label: "CNNs / Vision", icon: "🖼️", pct: 78 },
      { id: "rnn", label: "RNN / LSTM / GRU", icon: "🔁", pct: 72 },
      { id: "attention", label: "Attention / Transformers", icon: "🧩", pct: 79 },
      { id: "auto_gan", label: "Autoencoders / GANs", icon: "🎨", pct: 70 },
      { id: "diffusion", label: "Diffusion Basics", icon: "✶", pct: 66 },
      { id: "frameworks", label: "PyTorch / TensorFlow / Keras", icon: "🔥", pct: 81 },
      { id: "opencv", label: "OpenCV", icon: "📷", pct: 72 },
    ],
  },

  {
    id: "nlp",
    label: "NLP & LLM Foundations",
    icon: "🔡",
    title: "NLP & LLM Foundations",
    description: "Tokenization · Embeddings · Transformers · NER · Classification",
    skills: [
      { id: "token", label: "Tokenization / Text Prep", icon: "✂️", pct: 82 },
      { id: "embeddings", label: "Word Embeddings / Vectors", icon: "🧭", pct: 80 },
      { id: "transformer_nlp", label: "Transformer NLP (BERT/GPT)", icon: "🧠", pct: 79 },
      { id: "ner", label: "NER / Doc Classification", icon: "🔎", pct: 76 },
      { id: "llm_finetune", label: "LLMs & Fine-tuning", icon: "🤖", pct: 78 },
      { id: "token_theory", label: "Embeddings & Tokenization Theory", icon: "📚", pct: 75 },
    ],
  },

  {
    id: "genai",
    label: "GenAI, LLMs & Multimodal",
    icon: "🧬",
    title: "GenAI, LLMs & Multimodal",
    description: "Prompting · LoRA / PEFT · RAG · Multimodal (CLIP, LLaVA)",
    skills: [
      { id: "prompting", label: "Prompt Engineering", icon: "💬", pct: 86 },
      { id: "lora", label: "LoRA / QLoRA / PEFT", icon: "🔧", pct: 74 },
      { id: "rag", label: "RAG (Retrieval-Augmented)", icon: "📚", pct: 78 },
      { id: "langchain", label: "LangChain / LangGraph", icon: "🧭", pct: 75 },
      { id: "halluc", label: "Hallucination Reduction", icon: "🛡️", pct: 70 },
      { id: "multimodal", label: "CLIP / LLaVA (Multimodal)", icon: "🔗", pct: 72 },
      { id: "generation", label: "Image / Video / Speech Gen", icon: "🎥", pct: 70 },
      { id: "speech", label: "TTS / ASR / Voice Cloning", icon: "🔊", pct: 68 },
    ],
  },

  {
    id: "agentic",
    label: "Agentic AI & Autonomous Systems",
    icon: "🤖",
    title: "Agentic AI & Autonomous Systems",
    description: "Agents, Tool Use, Memory, Multi-Agent Orchestration",
    skills: [
      { id: "react", label: "ReAct / Plan-and-Execute", icon: "🧭", pct: 72 },
      { id: "agents", label: "LangChain Agents / Workflows", icon: "🛠️", pct: 74 },
      { id: "tooling", label: "Function Calling / Tool APIs", icon: "🔗", pct: 72 },
      { id: "multi_agent", label: "Multi-Agent Orchestration", icon: "⚙️", pct: 68 },
      { id: "memory", label: "Memory Systems", icon: "🧠", pct: 70 },
      { id: "kg", label: "Knowledge Graphs / Vector Indexing", icon: "📎", pct: 68 },
      { id: "mcp", label: "MCP (Model Context Protocol)", icon: "🧾", pct: 64 },
    ],
  },

  {
    id: "mlops",
    label: "ML Engineering, Deployment & MLOps",
    icon: "⚙️",
    title: "ML Engineering, Deployment & MLOps",
    description: "Docker · Kubernetes · Vector DBs · MLflow · Monitoring",
    skills: [
      { id: "docker", label: "Docker", icon: "🐳", pct: 82 },
      { id: "microservices", label: "Microservices & APIs", icon: "🔌", pct: 80 },
      { id: "cloud_deploy", label: "Cloud Deployment (AWS/Azure)", icon: "☁️", pct: 78 },
      { id: "realtime", label: "Real-Time Inference", icon: "⚡", pct: 72 },
      { id: "vectordb", label: "Vector DBs (FAISS/Pinecone)", icon: "🧭", pct: 76 },
      { id: "mlflow", label: "MLflow / Model Registry", icon: "📦", pct: 74 },
      { id: "k8s", label: "Kubernetes", icon: "📦", pct: 70 },
      { id: "monitor", label: "Monitoring & Logging", icon: "📡", pct: 72 },
    ],
  },

  {
    id: "cloud_soft",
    label: "Cloud, Soft Skills & Data Generation",
    icon: "☁️",
    title: "Cloud, Soft Skills & Data Generation",
    description: "AWS / Azure · Communication · Synthetic Data · Leadership",
    skills: [
      { id: "aws", label: "AWS (S3, EC2, Lambda, SageMaker)", icon: "☁️", pct: 77 },
      { id: "azure", label: "Azure (Blob, AKS, Entra)", icon: "🔵", pct: 74 },
      { id: "soft_skills", label: "Problem Solving / Communication", icon: "🗣️", pct: 84 },
      { id: "leadership", label: "Leadership & Teamwork", icon: "🤝", pct: 76 },
      { id: "debug", label: "Debugging Mindset", icon: "🔧", pct: 80 },
      { id: "synth", label: "Synthetic Data Generation", icon: "🧪", pct: 68 },
      { id: "augmentation", label: "Data Augmentation", icon: "🧩", pct: 70 },
    ],
  },
];
