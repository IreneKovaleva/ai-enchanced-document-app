from dotenv import load_dotenv
import os
import argparse
from gensim import corpora
from gensim.models import LdaModel
import string
from pinecone.grpc import PineconeGRPC
import sys

load_dotenv()

stop_words = {"the", "of", "and", "to", "in", "as", "from", "for", "with", "on", "by", "an", "at", "or", "that"}


def preprocess_text(text):
    tokens = text.lower().translate(str.maketrans('', '', string.punctuation)).split()
    tokens = [word for word in tokens if word not in stop_words]
    return tokens


def topic_modeling(texts, documents_number):
    processed_docs = [preprocess_text(text) for text in texts if text]
    dictionary = corpora.Dictionary(processed_docs)
    corpus = [dictionary.doc2bow(doc) for doc in processed_docs]

    num_topics = documents_number
    lda_model = LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)

    topics = lda_model.print_topics(-1)
    return topics


def convert_query_to_vector(user_query, pc):
    query_embedding = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[user_query],
        parameters={
            "input_type": "query"
        }
    )

    return query_embedding[0].values


def get_documents_from_pinecone(index_name, user_query, pc):
    index = pc.Index(index_name)
    query_vector = convert_query_to_vector(user_query, pc)
    if query_vector:
        results = index.query(
            namespace=index_name,
            vector=query_vector,
            top_k=3,
            include_values=False,
            include_metadata=True
        )
        return results['matches']


def update_document_metadata(index_name, document_id, new_metadata, pc):
    index = pc.Index(index_name)
    index.update(
        id=document_id,
        set_metadata=new_metadata,
        namespace=index_name
    )


def main():
    parser = argparse.ArgumentParser(
        description="Quantity of uploaded documents"
    )
    parser.add_argument("-n", required=True, type=str)
    parser.add_argument("-query", required=True, type=str)
    args = parser.parse_args()
    documents_number = args.n
    user_query = args.query
    print(sys.path)

    print(documents_number)
    pc = PineconeGRPC(api_key=os.getenv('PINECONE_API_KEY'))

    index_name = 'index-v-b'
    documents = get_documents_from_pinecone(index_name, user_query, pc)

    if not documents:
        print("No documents found for the query.")
        return

    texts = [doc['metadata']['text'] for doc in documents]
    topics = topic_modeling(texts, documents_number)

    for idx, (topic_id, topic) in enumerate(topics):
        new_metadata = {'topic': f"Topic {topic_id + 1}: {topic}"}
        document_id = documents[idx]['id']
        update_document_metadata(index_name, document_id, new_metadata, pc)
        print(f"Updated document ID {document_id} with new metadata: {new_metadata}")


if __name__ == "__main__":
    main()
