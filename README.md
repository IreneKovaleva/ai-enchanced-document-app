# AI-Enhanced Document QA System

This project is a document ingestion and question-answering system that leverages advanced AI models and vector databases. It demonstrates the ability to work with state-of-the-art AI tools and APIs, as well as an understanding of natural language processing and information retrieval concepts.

## Assumptions

To ensure a smooth setup and execution of the project, the following assumptions have been made:

* Technical Knowledge: Familiarity with JavaScript/TypeScript, React, Node.js, and Python is required for effective usage and modification of the codebase.
* Vector Database Understanding: Users should understand how to work with vector databases, including creating databases and storing data in Pinecone.
* API Accounts: Users are expected to have valid accounts and API keys for Pinecone (https://app.pinecone.io/) and the OpenAI Developer Platform (https://platform.openai.com/) prior to running the application.


## Installation

Clone the repository: 

```bash
git clone <repository-url>
cd <project-directory>
```

## Backend Setup:

1. Navigate to backend directory and install necessary packages:

```bash
cd ai-enhanced-document
npm install
```
2. Rename "env.example.txt" in the backend directory and fill in all variables

## Frontend Setup:

1. Navigate to frontend directory and install necessary React packages:

```bash
cd front-end-ai-enhanced-document
npm install
```

## Python Script Setup

1. Navigate to scripts directory in the backend folder and install the required Python packages:

```bash
cd ai-enhanced-document/scripts
pip install -r requirements.txt
```

## Running the Project

Start the Backend Server: In the backend directory, run:

```bash
npm start
```

Start the Frontend Application: In the frontend directory, run:

```bash
npm start
```

Once both servers are running, you can access the frontend application in your web browser, typically at http://localhost:3000.


## Challenges

* Model Selection: Analyzed various OpenAI API models to identify the most cost-effective and appropriate model for generating AI answers.
* Entity Extraction: Found solutions to extract entities from document text efficiently.
* Text Chunking: Investigated methods for chunking text in the RAG application, focusing on splitting text while including recognized entities.
* Data Structuring: Searched for effective solutions to structure data and create vectors for the Pinecone database.
* Vector Extraction: Worked on extracting necessary vectors to facilitate faster AI responses based on user queries, including embedding relevant text in AI messages to enhance accuracy.
* Topic Modeling Clarification: Faced challenges in defining the scope of topic modeling.

## Accepted Decisions

* Model Choice: Selected the gpt-4o-mini model for its cost-effectiveness, speed, and high accuracy in data retrieval.
* NLP Library: Chose Compromise for Natural Language Processing due to its clarity in function writing and ease of use.
* Chunking Library: Evaluated several libraries, including llm-chunk, LangChain, and LlamaIndex. Selected RecursiveCharacterTextSplitter from LangChain to ensure accurate text splitting while allowing for overlapping to avoid word breaks.
* Vectorization Strategy: Opted to use Pinecone for text vectorization based on its clear documentation and examples. This approach facilitated the inclusion of entities for precise searching within the database. I structured the object with arrays of key entities and their related sentences, allowing for targeted searches based on specific entities and ensuring rich data per entity.
* Vector Creation: Developed a strategy to create vectors from user questions to search for related vectors effectively.
* Importance of Topic Modeling and Metadata: Emphasized the significance of topic modeling and metadata for enhancing document retrieval and analysis. Topic modeling helps in understanding the content's themes, while metadata enriches the dataset, allowing for more refined searches and insights.
